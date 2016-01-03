var config = module.exports;

config["Tests"] = {
    env: "browser",
    tests: [
        "some-test.js"
    ],
    extensions: [{
        name: 'test-extension',
        create: function () {
            global.globalCallback();
        }
    }]
};
