module.exports = {
	paths : [ "lib/**/*.js", "test/**/*.js" ],
	linter : "jslint",
	linterOptions : {
		node : true,
		vars : true,
		plusplus : false,
		nomen : true,
		forin : true,
		regexp : true,
		es5 : true,
		sub : true,
		predef : [ "assert", "refute", "buster", "window", "document",
				"navigator" ]
	},
	excludes : []
};
