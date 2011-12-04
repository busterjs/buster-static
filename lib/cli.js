var buster = require("buster-core");
var bCli = require("buster-cli");
var fs = require("fs");
var http = require("http");

module.exports = buster.extend(bCli.create(), {
    loadOptions: function () {
        this.addConfigOption("browser");

        this.port = this.opt("-p", "--port", "The port to run the server on.", {
            defaultValue: 8282
        });

        this.path = this.opd("Output dir", "The directory to write the files to.");
    },

    onRun: function () {
        var self = this;

        this.onConfig(function (err, groups) {
            if (err) {
                self.logger.error(err.message);
                return;
            }

            var group = groups[0];
            if (group) {
                runWithConfigGroup.call(self, group);
            } else {
                self.logger.error("No 'browser' group found in specified configuration file.");
            }
        });
    },

    startServer: function (group) {
        this.httpServer = startServer(group.resourceSet, this.port.value, this.logger);
    },

    writeToDisk: function (group) {
    }
});


function runWithConfigGroup(group) {
    setupGroup(group);

    if (this.path.isSet) {
        this.writeToDisk(group);
    } else {
        this.startServer(group);
    }
}

// TODO: add test coverage (integration test?)
function setupGroup(group) {
    // Test bed
    group.resourceSet.addResource("/", {
        content: fs.readFileSync(__dirname + "/index.html", "utf8")
    });
    group.resourceSet.addScriptLoadingToRootResource();

    // Wiring between framework and user test cases
    group.resourceSet.addFile(
        require.resolve("buster-test/lib/buster-test/reporters/html"),
        {path: "/buster-static-html-reporter.js"}
    );
    group.resourceSet.addFile(
        require.resolve("./browser-wiring"),
        {path: "/buster-static-browser-wiring.js"}
    );
    group.resourceSet.prependToLoad(["/buster-static-browser-wiring.js", "/buster-static-html-reporter.js"]);


    // Load in the builtins
    group.setupFrameworkResources();

    // Runner
    group.resourceSet.addFile(
        require.resolve("./browser-run"),
        {path: "/buster-static-browser-run.js"}
    );
    group.resourceSet.appendToLoad(["/buster-static-browser-run.js"]);
}

function startServer(resourceSet, port, logger) {
    var server = http.createServer(function (req, res) {
        if (resourceSet.getResourceViaHttp(req, res)) return;

        res.writeHead(404);
        res.write("Not found");
        res.end();
    });
    server.listen(port);

    logger.log("Starting server on http://localhost:" + port + "/");

    return server;
}