(function (B) {
    var runner = B.testRunner.create({
        runtime: navigator.userAgent
    });
    var reporter = B.reporters.html.create({ root: document.body });
    reporter.listen(runner);
    B.wire(runner);
}(buster));
