var buster = require("buster");
var assert = buster.assert;

var cli = require("../lib/cli");

buster.testCase("buster-static", {
    setUp: function () {
        this.s = cli.create();
    },

    "should start server with no arguments": function (done) {
        this.stub(this.s, "startServer", function () {
            assert(true);
            done();
        });
        this.s.run(["--config", __dirname + "/fixtures/test-config.js"]);
    },

    "should start server on specified port with --port": function (done) {
        this.stub(this.s, "startServer", function () {
            assert(true);
            done();
        });
        this.s.run(["--config", __dirname + "/fixtures/test-config.js", "--port", "4224"]);
    },

    "should write to disk with operand": function (done) {
        this.stub(this.s, "writeToDisk", function () {
            assert(true);
            done();
        });
        this.s.run(["--config", __dirname + "/fixtures/test-config.js", "/tmp/static-test"]);
    }
});