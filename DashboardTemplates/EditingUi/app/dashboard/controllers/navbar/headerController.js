(function () {
    'use strict';
    var headerController = function ($scope) {

        var viewModel = function () {
            
            var sidebarToggleBtnClick = function (event) {
                //$scope.$emit('someComponent.someCrazyEvent', "My Value");
                event.preventDefault();

                //Enable sidebar push menu
                if ($(window).width() > (AppConfig.screenSizes.sm - 1)) {
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                    } else {
                        $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    }
                }
                    //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    } else {
                        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                    }
                }
            };

            return {
                SidebarToggleBtnClick: sidebarToggleBtnClick
            };
        }();

        $scope.headerViewModel = viewModel;
    };

    spa.dashboardApp.controller("HeaderController", headerController);
}());