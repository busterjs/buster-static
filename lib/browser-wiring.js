(function (B) {
    var runner = B.testRunner.create({
        runtime: navigator.userAgent
    });

    var matches = window.location.href.match(/(\?|&)reporter=([^&]*)/);
    var reporter = matches && matches[2] && B.reporters[matches[2]] || B.reporters.html;

    reporter.create({ root: document.body }).listen(runner);
    B.wire(runner);
}(buster));
