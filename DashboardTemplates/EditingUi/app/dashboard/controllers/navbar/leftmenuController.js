(function () {
    'use strict';
    var leftmenuController = function ($scope, $location) {

        var viewModel = function () {

            /* PushMenu()
            * ==========
            * Adds the push menu functionality to the sidebar.
            *
            * @type Function
            * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
            */
            var pushMenu = {
                activate: function(toggleBtn) {
                    //Get the screen sizes
                    //var screenSizes = options.screenSizes;

                    //Enable sidebar toggle
                    //$(toggleBtn).on('click', function(e) {
                    //    e.preventDefault();

                    //    //Enable sidebar push menu
                    //    if ($(window).width() > (screenSizes.sm - 1)) {
                    //        if ($("body").hasClass('sidebar-collapse')) {
                    //            $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                    //        } else {
                    //            $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    //        }
                    //    }
                    //        //Handle sidebar push menu for small screens
                    //    else {
                    //        if ($("body").hasClass('sidebar-open')) {
                    //            $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    //        } else {
                    //            $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                    //        }
                    //    }
                    //});

                    $(".content-wrapper").click(function() {
                        //Enable hide menu when clicking on the content-wrapper on small screens
                        if ($(window).width() <= (AppConfig.screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                            $("body").removeClass('sidebar-open');
                        }
                    });

                    //Enable expand on hover for sidebar mini
                    if (AppConfig.sidebarExpandOnHover || ($('body').hasClass('fixed') && $('body').hasClass('sidebar-mini'))) {
                        this.expandOnHover();
                    }
                },
                expandOnHover: function() {
                    var _this = this;
                    var screenWidth = AppConfig.screenSizes.sm - 1;
                    //Expand sidebar on hover
                    $('.main-sidebar').hover(function() {
                        if ($('body').hasClass('sidebar-mini')
                            && $("body").hasClass('sidebar-collapse')
                            && $(window).width() > screenWidth) {
                            _this.expand();
                        }
                    }, function() {
                        if ($('body').hasClass('sidebar-mini')
                            && $('body').hasClass('sidebar-expanded-on-hover')
                            && $(window).width() > screenWidth) {
                            _this.collapse();
                        }
                    });
                },
                expand: function() {
                    $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
                },
                collapse: function() {
                    if ($('body').hasClass('sidebar-expanded-on-hover')) {
                        $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
                    }
                }
            };

            /* Layout
           * ======
           * Fixes the layout height in case min-height fails.
           *
           * @type Object
           * @usage $.AdminLTE.layout.activate()
           *        $.AdminLTE.layout.fix()
           *        $.AdminLTE.layout.fixSidebar()
           */
            var layout = {
                activate: function () {
                    var _this = this;
                    _this.fix();
                    _this.fixSidebar();
                    $(window, ".wrapper").resize(function () {
                        _this.fix();
                        _this.fixSidebar();
                    });
                },
                fix: function () {
                    //Get window height and the wrapper height
                    var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
                    var window_height = $(window).height();
                    var sidebar_height = $(".sidebar").height();
                    //Set the min-height of the content and sidebar based on the
                    //the height of the document.
                    if ($("body").hasClass("fixed")) {
                        $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
                    } else {
                        var postSetWidth;
                        if (window_height >= sidebar_height) {
                            $(".content-wrapper, .right-side").css('min-height', window_height - neg);
                            postSetWidth = window_height - neg;
                        } else {
                            $(".content-wrapper, .right-side").css('min-height', sidebar_height);
                            postSetWidth = sidebar_height;
                        }

                        //Fix for the control sidebar height
                        var controlSidebar = $(AppConfig.controlSidebarOptions.selector);
                        if (typeof controlSidebar !== "undefined") {
                            if (controlSidebar.height() > postSetWidth)
                                $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
                        }

                    }
                },
                fixSidebar: function () {
                    //Make sure the body tag has the .fixed class
                    if (!$("body").hasClass("fixed")) {
                        if (typeof $.fn.slimScroll != 'undefined') {
                            $(".sidebar").slimScroll({ destroy: true }).height("auto");
                        }
                        return;
                    } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
                        window.console.error("Error: the fixed layout requires the slimscroll plugin!");
                    }
                    //Enable slimscroll for fixed layout
                    if (AppConfig.sidebarSlimScroll) {
                        if (typeof $.fn.slimScroll != 'undefined') {
                            //Destroy if it exists
                            $(".sidebar").slimScroll({ destroy: true }).height("auto");
                            //Add slimscroll
                            $(".sidebar").slimscroll({
                                height: ($(window).height() - $(".main-header").height()) + "px",
                                color: "rgba(0,0,0,0.2)",
                                size: "3px"
                            });
                        }
                    }
                }
            };

            /* Tree()
            * ======
            * Converts the sidebar into a multilevel
            * tree view menu.
            *
            * @type Function
            * @Usage: $.AdminLTE.tree('.sidebar')
            */
            var tree = function (menu) {
                var _this = this;
                var animationSpeed = AppConfig.animationSpeed;
                $(document).on('click', menu + ' li a', function (e) {
                    //Get the clicked link and the next element
                    var $this = $(this);
                    var checkElement = $this.next();

                    //Check if the next element is a menu and is visible
                    if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                        //Close the menu
                        checkElement.slideUp(animationSpeed, function () {
                            checkElement.removeClass('menu-open');
                            //Fix the layout in case the sidebar stretches over the height of the window
                            //_this.layout.fix();
                        });
                        checkElement.parent("li").removeClass("active");
                    }
                        //If the menu is not visible
                    else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                        //Get the parent menu
                        var parent = $this.parents('ul').first();
                        //Close all open menus within the parent
                        var ul = parent.find('ul:visible').slideUp(animationSpeed);
                        //Remove the menu-open class from the parent
                        ul.removeClass('menu-open');
                        //Get the parent li
                        var parent_li = $this.parent("li");

                        //Open the target menu and add the menu-open class
                        checkElement.slideDown(animationSpeed, function () {
                            //Add the class active to the parent li
                            checkElement.addClass('menu-open');
                            parent.find('li.active').removeClass('active');
                            parent_li.addClass('active');
                            //Fix the layout in case the sidebar stretches over the height of the window
                            layout.fix();
                        });
                    }
                    //if this isn't a link, prevent the page from being redirected
                    if (checkElement.is('.treeview-menu')) {
                        e.preventDefault();
                    }
                });
            };

            var init = function () {
                pushMenu.activate(AppConfig.sidebarToggleSelector);
                tree('.sidebar');
            };

            return {
                Init: init
            };
        }();

        $scope.$onRootScope('someComponent.someCrazyEvent', function () {
            console.log('foo');
        });

        $scope.leftmenuViewModel = viewModel;
    };

    spa.dashboardApp.controller("LeftMenuController", leftmenuController);
}());