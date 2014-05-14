module.exports = {
	paths : [ "lib/**/*.js", "test/**/*.js" ],
	linter : "jshint",
	linterOptions : {
	    maxlen: 85,
		node : true,
		onevar: false,
		plusplus : false,
		nomen : true,
		forin : true,
		regexp : false,
		es5 : true,
		sub : true,
		predef : [ "assert", "refute", "buster", "window", "document",
				"navigator" ]
	},
	excludes : []
};
