exports.conf = {
	"paths" : {
		"src":"./source",
		"tmp":"./temp",
		"dst":"./build",

		"assets":"/assets"
	},
	"assets": {
		"css" : {
			"less" :"/assets/less/style.less",
			"files":"/assets/css/*.css",
			"path" :"/assets/css",
			"min"  :"style.min.css"
		},
		"js": {
			"files":"/assets/js/*.js",
			"path":"/assets/js",
			"min"  :"script.min.js"
		},
		"html": {
			"files":"/*.html",
			"incl" :"/**/*.html"
		},
		"assets" : {
			"images":"/assets/images/*.*",
			"fonts" :"/assets/fonts/*.*",
			"files" :"/assets/files/*.*",
		}
	},
	"bower": {
		"js" : [
			"./bower_components/jquery/dist/jquery.min.js",
			"./bower_components/smooth-scroll/smooth-scroll.min.js",
			"./bower_components/wow/dist/wow.js"
			],
		"css" : [
	  		"./bower_components/animate.css/animate.min.css"
			],
		"dst" : {
			"js" : "vendor.min.js",
			"css": "vendor.min.css"
		}
	}
};

