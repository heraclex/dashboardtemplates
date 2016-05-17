(function () {
    'use strict';
    var leftmenuController = function ($scope, $location) {

        var viewModel = function () {
            // Init Left Menu
            $(function () { $('#side-menu').metisMenu(); });
            $(window).bind("load resize", function () {
                var topOffset = 50;
                var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                if (width < 768) {
                    $('div.navbar-collapse').addClass('collapse');
                    topOffset = 100; // 2-row-menu
                } else {
                    $('div.navbar-collapse').removeClass('collapse');
                }

                var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
                height = height - topOffset;
                if (height < 1) height = 1;
                if (height > topOffset) {
                    $("#page-wrapper").css("min-height", (height) + "px");
                }
            });

            //var url = window.location;
            //var element = $('ul.nav a').filter(function () {
            //    return this.href == url || url.href.indexOf(this.href) == 0;
            //}).addClass('active').parent().parent().addClass('in').parent();
            //if (element.is('li')) {
            //    element.addClass('active');
            //}

            var options = {
                //Add slimscroll to navbar menus
                //This requires you to load the slimscroll plugin
                //in every page before app.js
                navbarMenuSlimscroll: true,
                navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
                navbarMenuHeight: "200px", //The height of the inner menu
                //General animation speed for JS animated elements such as box collapse/expand and
                //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
                //'fast', 'normal', or 'slow'
                animationSpeed: 500,
                //Sidebar push menu toggle button selector
                sidebarToggleSelector: "[data-toggle='offcanvas']",
                //Activate sidebar push menu
                sidebarPushMenu: true,
                //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
                sidebarSlimScroll: true,
                //Enable sidebar expand on hover effect for sidebar mini
                //This option is forced to true if both the fixed layout and sidebar mini
                //are used together
                sidebarExpandOnHover: false,
                //BoxRefresh Plugin
                enableBoxRefresh: true,
                //Bootstrap.js tooltip
                enableBSToppltip: true,
                BSTooltipSelector: "[data-toggle='tooltip']",
                //Enable Fast Click. Fastclick.js creates a more
                //native touch experience with touch devices. If you
                //choose to enable the plugin, make sure you load the script
                //before AdminLTE's app.js
                enableFastclick: true,
                //Control Sidebar Options
                enableControlSidebar: true,
                controlSidebarOptions: {
                    //Which button should trigger the open/close event
                    toggleBtnSelector: "[data-toggle='control-sidebar']",
                    //The sidebar selector
                    selector: ".control-sidebar",
                    //Enable slide over content
                    slide: true
                },
                //Box Widget Plugin. Enable this plugin
                //to allow boxes to be collapsed and/or removed
                enableBoxWidget: true,
                //Box Widget plugin options
                boxWidgetOptions: {
                    boxWidgetIcons: {
                        //Collapse icon
                        collapse: 'fa-minus',
                        //Open icon
                        open: 'fa-plus',
                        //Remove icon
                        remove: 'fa-times'
                    },
                    boxWidgetSelectors: {
                        //Remove button selector
                        remove: '[data-widget="remove"]',
                        //Collapse button selector
                        collapse: '[data-widget="collapse"]'
                    }
                },
                //Direct Chat plugin options
                directChat: {
                    //Enable direct chat by default
                    enable: true,
                    //The button to open and close the chat contacts pane
                    contactToggleSelector: '[data-widget="chat-pane-toggle"]'
                },
                //Define the set of colors to use globally around the website
                colors: {
                    lightBlue: "#3c8dbc",
                    red: "#f56954",
                    green: "#00a65a",
                    aqua: "#00c0ef",
                    yellow: "#f39c12",
                    blue: "#0073b7",
                    navy: "#001F3F",
                    teal: "#39CCCC",
                    olive: "#3D9970",
                    lime: "#01FF70",
                    orange: "#FF851B",
                    fuchsia: "#F012BE",
                    purple: "#8E24AA",
                    maroon: "#D81B60",
                    black: "#222222",
                    gray: "#d2d6de"
                },
                //The standard screen sizes that bootstrap uses.
                //If you change these in the variables.less file, change
                //them here too.
                screenSizes: { xs: 480, sm: 768, md: 992, lg: 1200 }
            };





            var init = function() {
            };

            return {
                Init: init,
                Active: function (event) {
                    var activeElement = $('a.active');
                    activeElement.removeClass('active');

                    var currentElement = $(event.currentTarget);
                    currentElement.addClass('active');
                }
            };
        }();

        $scope.leftmenuViewModel = viewModel;
    };

    spa.dashboardApp.controller("LeftMenuController", leftmenuController);
}());