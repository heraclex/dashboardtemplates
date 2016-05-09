
(function () {
    'use strict';

    // register external module
    spa.dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ui.bootstrap', 'kendo.directives']);

    // Global Configuration
    spa.dashboardApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/Dashboard', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/_common/dashboard.html',
            })
            .when('/ManageUserProfile', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/userProfile/index.html', controller: 'UserProfileController'
            })
            .when('/ManageAccount', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/account/index.html', controller: 'AccountController'
            })
            .when('/ManageDivision', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/division/index.html', controller: 'DivisionController'
            })
            .when('/ManageProject', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/project/index.html', controller: 'ProjectController'
            })
            .when('/ManageProduct', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/product/index.html', controller: 'ProductController'
            })
            .when('/ViewCJAStatus', {
                templateUrl: Helpers.rootUrl + 'app/admin/views/importStatus/index.html', controller: 'ImportStatusController'
            })
            .otherwise({ redirectTo: '/Dashboard' });

        $locationProvider.html5Mode(true);
        $httpProvider.defaults.timeout = 60000;
        //$httpProvider.interceptors.push('AppInterceptor');
    });

    spa.dashboardApp.run(function (stConfig, editableOptions) {
        //stConfig.pagination.template = Helpers.rootUrl + 'app/admin/views/_common/custom-pagination-tmpl.html';
        //editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });
}());