var bCli = require("buster-cli");
var fs = require("fs");
var http = require("http");
var rampResources = require("ramp-resources");

// TODO: add test coverage (integration test?)
function configureGroup(group, extensions) {
    group.extensions = extensions;
    group.on("load:framework", function (resourceSet) {
        // Test bed
        resourceSet.addResource({
            path: "/",
            file: __dirname + "/index.html"
        });

        // Wiring between framework and user test cases
        resourceSet.addResources([{
            file: require.resolve("buster-test/lib/reporters/runtime-throttler"),
            path: "/buster/runtime-throttler.js"
        }, {
            file: require.resolve("buster-test/lib/reporters/html"),
            path: "/buster/html-reporter.js"
        }, {
            file: require.resolve("stack-filter/lib/stack-filter"),
            path: "/buster/stack-filter.js"
        }, {
            file: require.resolve("./browser-wiring"),
            path: "/buster/static-browser-wiring.js"
        }, {
            content: "this.bane = buster.bane; this._ = buster._;",
            path: "/buster/expose-modules.js"
        }, {
            content: "delete this.bane; delete this._;",
            path: "/buster/remove-modules.js"
        }, {
            path: "/buster/static-bundle.js",
            combine: ["/buster/expose-modules.js",
                      "/buster/stack-filter.js",
                      "/buster/runtime-throttler.js",
                      "/buster/html-reporter.js",
                      "/buster/static-browser-wiring.js",
                      "/buster/remove-modules.js"]
        }]);

        // Some neat CSS
        resourceSet.addResource({
            file: require.resolve("buster-test/resources/buster-test.css"),
            path: "/buster-test.css"
        });

        // Runner
        var options = { resetDocument: false };
        if (group.config.hasOwnProperty("autoRun")) {
            options.autoRun = group.config.autoRun;
        }
        resourceSet.addResource({
            content: "buster.ready(" + JSON.stringify(options) + ");",
            path: "/buster/browser-run.js"
        });

        resourceSet.whenAllAdded(function (rs) {
            rs.loadPath.append("/buster/static-bundle.js");
        });
    });

    group.on("load:resources", function (resourceSet) {
        resourceSet.loadPath.append(["/buster/browser-run.js"]);
    });

    // Load in the builtins
    // group.bundleFramework();
}

function runWithConfigGroup(cli, resourceSet, options) {
    // if (options["Output dir"].isSet) {
    //     cli.writeToDisk(resourceSet);
    // } else {
        cli.startServer(resourceSet, options["--port"].value);
    // }
}

function startServer(resourceSet, port, logger) {
    var middleware = rampResources.createMiddleware();
    middleware.mount("/", resourceSet);
    var server = http.createServer(function (req, res) {
        if (middleware.respond(req, res)) { return; }
        res.writeHead(404);
        res.write("Not found");
        res.end();
    });
    server.listen(port);

    logger.log("Starting server on http://localhost:" + port + "/");

    return server;
}

function addCLIArgs(cli) {
    cli.addConfigOption("buster");

    cli.addHelpOption("Run tests from a static web page", "");

    cli.opt(["-p", "--port"], {
        description: "The port to run the server on.",
        defaultValue: 8282
    });

    // cli.opd("Output dir", "The directory to write the files to.");
}

function BusterStatic(stdout, stderr, options) {
    options = options || {};
    this.cli = bCli.create();
    this.logger = this.cli.createLogger(stdout, stderr);
    this.extensions = options.extensions || [];
}

BusterStatic.prototype = module.exports = {
    create: function (stdout, stderr, options) {
        return new BusterStatic(stdout, stderr, options);
    },

    run: function (cliArgs) {
        var self = this;
        addCLIArgs(this.cli);

        this.cli.parseArgs(cliArgs, function (err, options) {
            if (err) {
                self.logger.error(err.message);
                process.exit(1);
            }

            if (options["--help"].isSet) {
                process.exit(0);
            }

            self.cli.loadConfig(options, function (err, groups) {
                if (err) {
                    return self.logger.error(err.message);
                }

                var browserGroups = groups.filter(function (g) { return g.environment === "browser"; });

                if (browserGroups[0]) {
                    configureGroup(browserGroups[0], self.extensions);
                    browserGroups[0].resolve().then(function (resourceSet) {
                        runWithConfigGroup(self, resourceSet, options);
                    }, function (err) {
                        self.logger.error(err.message);
                    });
                } else {
                    self.logger.error("No 'browser' group found in specified " +
                                      "configuration file.");
                }
            });
        });
    },

    startServer: function (resourceSet, port) {
        this.httpServer = startServer(resourceSet, port, this.logger);
    },

    writeToDisk: function (resourceSet) {
        console.log("Not yet supported");
    }
};
