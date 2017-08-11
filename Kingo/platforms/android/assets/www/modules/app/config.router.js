var app = angular.module('kingo');
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $authProvider, $locationProvider) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        $stateProvider

            .state('signin', {
                url: '/signin',
                templateUrl: 'modules/login/sign_in.html',
                resolve: loadSequence('login'),
                controller: 'SigninCtrl'

            })
            .state('register', {
                url: '/register',
                templateUrl: 'modules/registration/registration.html',
                resolve: loadSequence('register'),
                controller: 'RegistrationCtrl'

            })
            .state('direction', {
                url: '/direction',
                templateUrl: 'modules/direction/direction.html',
                resolve: loadSequence('direction'),
                controller: 'DirectionCtrl'
            })
            .state('tracking', {
                url: '/tracking',
                templateUrl: 'modules/tracking/tracking.html',
                resolve: loadSequence('direction'),
                controller: 'TrackingCtrl'
            })
            .state('dir-tracking', {
                url: '/dir-tracking',
                templateUrl: 'modules/direction_tracking/direction_tracking.html',
                resolve: loadSequence('direction'),
                controller: 'DirectionTrackingCtrl'
            })
            .state('live-tracking', {
                url: '/live-tracking',
                templateUrl: 'modules/live_tracking/live_tracking.html',
                resolve: loadSequence('direction'),
                controller: 'LiveTrackingCtrl'
            })
            ;

        $urlRouterProvider.otherwise('signin');
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return console.error('Route resolve: Bad resource name');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }

    }]);
