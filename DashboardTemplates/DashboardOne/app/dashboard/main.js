
(function () {
    'use strict';

    // register external module
    spa.dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ui.bootstrap']);

    // Global Configuration
    spa.dashboardApp.config(function ($routeProvider, $locationProvider, $httpProvider, $provide) {
        $routeProvider
            .when('/Dashboard', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/_common/dashboard.html',
            })
            .otherwise({ redirectTo: '/Dashboard' });

        $locationProvider.html5Mode(true);
        $httpProvider.defaults.timeout = 60000;
        //$httpProvider.interceptors.push('AppInterceptor');
        
        // http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs
        $provide.decorator('$rootScope', ['$delegate', function ($delegate) {

            Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                value: function (name, listener) {
                    var unsubscribe = $delegate.$on(name, listener);
                    this.$on('$destroy', unsubscribe);

                    return unsubscribe;
                },
                enumerable: false
            });


            return $delegate;
        }]);
    });

    spa.dashboardApp.run(function () {
        
    });
}());