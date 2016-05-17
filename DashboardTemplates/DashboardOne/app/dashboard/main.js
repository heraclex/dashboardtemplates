
(function () {
    'use strict';

    // register external module
    spa.dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ui.bootstrap']);

    // Global Configuration
    spa.dashboardApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/Dashboard', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/_common/dashboard.html',
            })
            .otherwise({ redirectTo: '/Dashboard' });

        $locationProvider.html5Mode(true);
        $httpProvider.defaults.timeout = 60000;
        //$httpProvider.interceptors.push('AppInterceptor');
    });

    spa.dashboardApp.run(function () {
        
    });
}());