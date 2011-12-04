(function (B) {
    B.contextsForStatic = [];
    B.addTestContext = function (context) { contexts.push(context); };
    B.testCase.onCreate = B.addTestContext;
    B.spec.describe.onCreate = B.addTestContext;
}(buster));