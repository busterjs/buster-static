var buster = require("buster-core");
var bCli = require("buster-cli");

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
    },

    writeToDisk: function (group) {
    }
});

function runWithConfigGroup(group) {
    if (this.path.isSet) {
        this.writeToDisk(group);
    } else {
        this.startServer(group);
    }
}