(function() {

    var HAS_PACKAGE = !this.NO_PACKAGE;

    var modules = ['jasmine'];
    HAS_PACKAGE && modules.unshift('text!../package.json');

    // no cache
    seajs.config({
        debug: 1
    });


    seajs.use(modules, function(data) {
        seajs.config({
            alias: data.seaDependencies
        });

        var jasmineEnv = getJasmineEnv();

        // Make alias
        this.test = it;
        this.xtest = xit;

        // Go
        runSpecs();


        function getJasmineEnv() {
            var env = jasmine.getEnv();
            env.updateInterval = 1000;

            var trivialReporter = new jasmine.TrivialReporter();

            env.addReporter(trivialReporter);

            env.specFilter = function(spec) {
                return trivialReporter.specFilter(spec);
            };

            return env;
        }


        function runSpecs() {
            var meta = HAS_PACKAGE ? data : {};
            var tests = meta['tests'] || [];

            // Get the default test from path: path/to/xxx/tests/runner.html
            if (tests.length === 0) {
                tests.push(location.href
                        .replace(/.+\/([\w-]+)\/tests\/runner.+/, '$1'));
            }

            var specs = [];
            for (var i = 0; i < tests.length; i++) {
                specs[i] = './' + tests[i] + '-spec.js';
            }

            seajs.use(specs, function() {
                jasmineEnv.execute();
            });
        }

    });

})();
