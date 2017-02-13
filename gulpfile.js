// Load gulp plugins with 'require' function of nodejs
var gulp      = require('gulp'),
  plumber     = require('gulp-plumber'),
  gutil       = require('gulp-util'),
  uglify      = require('gulp-uglify'),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  minifyCSS   = require('gulp-minify-css'),
  less        = require('gulp-less'),
  del         = require('del');
  path        = require('path'),
  livereload  = require('gulp-livereload'),
  browserSync = require('browser-sync'),
  include     = require('gulp-html-tag-include'),
  filter      = require('gulp-filter'),
  sequence    = require('run-sequence'),
  conf        = require('./gulp-config');

conf = conf.conf;
// Handle less error
var onError = function (err) {
  gutil.beep();
  console.log(err);
};

//Extension config
//var extension = 'html';

/***** Functions for tasks *****/
  function htmlInclude() {
    //console.log(conf);
    return gulp.src(path.join(conf.paths.src,conf.assets.html.files))
        .pipe(include())
        .pipe(gulp.dest(conf.paths.tmp))
        .pipe(livereload());
  };

  function js() {
    gulp.src(conf.bower.js)
      .pipe(concat('dist'))
      .pipe(rename(conf.bower.dst.js))
      //.pipe(uglify())
      .pipe(gulp.dest(path.join(conf.paths.tmp,conf.assets.js.path)));

    return gulp.src([
          path.join(conf.paths.src,conf.assets.js.files),
          path.join('!' + conf.paths.src,conf.assets.js.path, '/',conf.bower.dst.js)
        ])
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(concat('dist'))
        .pipe(rename(conf.assets.js.min))
        //.pipe(uglify())
        .pipe(gulp.dest(path.join(conf.paths.tmp,conf.assets.js.path)))
        .pipe(livereload());
  }

  /*function less(env) {
    return gulp.src(less_file)
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(less({ paths: [ path.join(__dirname, 'less', 'includes') ] }))
        .pipe(gulp.dest(path.join(conf.paths.src,conf.assets.css.path)));
        //.pipe(livereload());
  }*/

  function css(env) {
    // vendor pack
    gulp.src(conf.bower.css)
      .pipe(concat('dist'))
      .pipe(rename(conf.bower.dst.css))
      .pipe(minifyCSS({keepBreaks:false, keepSpecialComments: false}))
      .pipe(gulp.dest(path.join(conf.paths.tmp,conf.assets.css.path)));

    gulp.src(path.join(conf.paths.src,conf.assets.css.less))
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(less({ paths: [ path.join(__dirname, 'less', 'includes') ] }))
        .pipe(gulp.dest(path.join(conf.paths.src,conf.assets.css.path)));
    
    //console.log(css);
    return gulp.src([
          path.join(conf.paths.src,conf.assets.css.files),
          path.join('!' + conf.paths.src,conf.assets.css.path, '/',conf.bower.dst.css)
        ])
        .pipe(concat('dist'))
        .pipe(rename(conf.assets.css.min))
        //.pipe(minifyCSS({keepBreaks:false, keepSpecialComments: false}))
        .pipe(gulp.dest(path.join(conf.paths.tmp,conf.assets.css.path)))
        .pipe(livereload());
  }

  function assets() {
    var fileFilter = filter(function (file)
    {
        return file.stat.isFile();
    });
    return gulp.src([
            path.join(conf.paths.src,conf.paths.assets, '/**/*'),
            path.join('!' + conf.paths.src,conf.paths.assets, '/**/*.{html,css,js,scss,less}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.tmp,conf.paths.assets,'/')));
  }

  function clean() {
    return del(path.join(conf.paths.tmp, '/'));
  }

  /*function reloadBrowser() {
    return gulp.src('*.html')
        .pipe(livereload());
  }

  function browserSync() {
    return browserSync({
      server: {
        baseDir: "./"
      }
    });
  }*/

/***** Tasks *****/
  gulp.task('browser-sync', function() {    return browserSync();  });
  gulp.task('html-include', function() {    return htmlInclude();  });
  gulp.task('js', function() {              return js();  });
  gulp.task('css', function(){              return css();  });
  gulp.task('less', function(){             return less();  });
  gulp.task('assets', function() {          return assets();  });
  gulp.task('clean', function() {           return clean();  });
  gulp.task('reload-browser', function() {  return reloadBrowser();  });




gulp.task('init', function() {
  clean().then(function () {//,'assets'
    sequence('html-include','js','css','assets',
    function (){
      console.log("Init done");
    });
  })
});

// The 'default' task.
gulp.task('watch', function() {
  clean().then(function () { 
    sequence('html-include','js','css','assets', function() { 
    // watchers  
    livereload.listen();
    browserSync({ server: {  baseDir: conf.paths.tmp  }  });

    gulp.watch([
        path.join(conf.paths.src,conf.assets.html.files),
        path.join(conf.paths.src,conf.assets.html.incl)
      ], 
      function() {
        browserSync.reload();
        return htmlInclude();
      });

      gulp.watch('*.html', function(){
        console.log('Browse reloaded!');
        return reloadBrowser();
      });
      gulp.watch('*.html', function(){
        console.log('Browse reloaded!');
        return reloadBrowser();
      });


    gulp.watch(path.join(conf.paths.src,conf.assets.css.less), function() {
      return less();
    });

    gulp.watch(path.join(conf.paths.src,conf.assets.css.files), function() {
      browserSync.reload();
      return css();
    });

    gulp.watch(path.join(conf.paths.src,conf.assets.js.files), function() {
      browserSync.reload();
      return js();
    });

    gulp.watch([
      path.join(conf.paths.src, conf.paths.assets, '/**/*'),
      path.join('!' + conf.paths.src, conf.paths.assets, '/**/*.{html,css,js,scss,less}'),
    ],
      function() {
        return assets();
      });

    
    });
  })
});

gulp.task('build', function() {
  // clean build folder
  del(path.join(conf.paths.dst, '/'));
  //clean().then(function () {//,'assets'
  sequence('html-include','js','css','assets',
  function (){
    new Promise(function(resolve, reject) {
      gulp.src([
        path.join(conf.paths.tmp,'/*.*'),
        path.join(conf.paths.tmp,'/**/*.*')
      ])
      .pipe(gulp.dest(path.join(conf.paths.dst,'/')))
      .on('end', resolve).on('error', reject);
    }).then(function () {
      gulp.start('clean')
    });//.pipe(gulp.start('clean'));
    
  });
  //})
});