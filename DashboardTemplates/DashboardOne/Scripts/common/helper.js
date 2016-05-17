(function ($) {
    UtilityClass = function () { };

    UtilityClass.prototype = {
        init: UtilityClass,

        rootUrl: '',
        userName: '',

        isNull: function(element) {
            return (typeof element === "undefined" || element === null || element.length == 0);
        },

        isNullOrEmpty: function(element) {
            return (Helpers.isNull(element) || element === '');
        },

        isFunction: function(func) {
            return typeof func === "function";
        },
        
        isNumber: function (str) {
            var intRegex = /^\d+$/;
            var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;

            if (intRegex.test(str) || floatRegex.test(str)) {
                return true;
            }

            return false;
        },

        resolveUrl: function (url) {
            return Helpers.rootUrl + url;
        },

        //get url from controller, action
        urlBuilder: function (controller, action, params) {
            var SLASH = '/';
            var QUESTION_MASK = '?';
            var rootUrl = Helpers.rootUrl;
            var url;
            if (rootUrl === '/') {
                url = SLASH + controller + SLASH + action + QUESTION_MASK + params;
            } else {
                url = rootUrl + SLASH + controller + SLASH + action + QUESTION_MASK + params;
            }

            return url;
        },
        
        applyNumericFilterForTextbox: function (element) {
            if (!Helpers.isNullOrEmpty(element)
                && element.get(0).tagName.toLowerCase() == 'input' && element.get(0).type.toLowerCase() == 'text') {
                element.on('input', function () {
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
            }
        },

        //extend from an object
        extend: function (protobj, skipBaseConstructor) {
            protobj = protobj || {};
            var subClass = null;
            var baseConstructor = this;
            if (typeof (baseConstructor) != "function") {
                baseConstructor = this.init;
            }

            if (protobj.init) {
                subClass = function () {
                    if (!skipBaseConstructor) {
                        baseConstructor.apply(this, arguments);
                    }
                    protobj.init.apply(this, arguments);
                };
            } else {
                subClass = function () {
                    if (!skipBaseConstructor) {
                        baseConstructor.apply(this, arguments);
                    }
                };
                protobj.init = baseConstructor;
            }
            subClass.prototype = subClass.prototype || {};
            $.extend(true, subClass.prototype, this.prototype, protobj);
            subClass.extend = this.extend;
            return subClass;
        },
    };
    Helpers = new UtilityClass();

    //*************Ajax Core functions********************************************//
    Helpers.AjaxCore = Helpers.extend({
        JSONCONTENTTYPE: 'application/json',
        JSON: 'json',
        HTML: 'html',
        POST: 'POST',
        GET: 'GET',
        SLASH: '/',
        AND: '&',
        QUESTION_MARK: '?',

        //called when an ajax request is completed
        ajaxComplete: function () {
            this.unblockUI();
        },
        
        blockUI: function (elementId) {
            this.mask = {
                css: { backgroundColor: 'transparent', border: 'none', zIndex: 999 },
                message: "<img src='/Content/images/portalContentLoader.gif' />"
            };
            if (elementId) {
                $("#" + elementId).block(this.mask);
                this.mask.elementId = elementId;
            } else {
                $.blockUI(this.mask);
            }
        },
        
        unblockUI: function () {
            if (this.mask) {
                if (this.mask.elementId) {
                    $("#" + this.mask.elementId).unblock();
                } else {
                    $.unblockUI();
                }
                this.mask = null;
            }
        },

        getRootUrl: function () {
            var rootUrl = Helpers.rootUrl;
            if (/\/.+/.test(rootUrl)) {
                rootUrl = rootUrl + this.SLASH;
            }
            return rootUrl;
        },

        //get url from controller, action
        buildUrl: function (controller, action) {
            var rootUrl = this.getRootUrl();
            var url = rootUrl + controller + this.SLASH + action;
            return url;
        },

        //send ajax request
        ajax: function (options) {
            var url = options.url,
                async = (typeof options.async === 'undefined') ? true : options.async,
                traditional = options.traditional == undefined ? false : options.traditional;
            if (!url) {
                url = this.buildUrl(options.controller, options.action);
            }
            if (options.showMask) {
                this.blockUI(options.showMask.elementId);
            }

            $.ajax({
                url: url,
                data: options.data,
                dataType: options.dataType,
                type: options.type,
                contentType: options.contentType,
                cache: options.cache,
                async: async,
                traditional: traditional,
                context: this,
                //beforeSend: function (jqXHR) {
                //    if (options.type == this.POST) {
                //        // inject Verification Token into header for each if type is POST
                //        jqXHR.setRequestHeader(
                //            '__RequestVerificationToken',
                //            $('[name=__RequestVerificationToken]').val());
                //    }
                //},
                success: function (result, textStatus, jqXHR) {
                    var isSuccessful = true;
                    if (result) {
                        if (result.redirect) {
                            window.location = result.redirect;
                            isSuccessful = false;
                        }
                    }
                    if (isSuccessful) {
                        try {
                            options.success.call(this, result);
                        } catch (error) {
                            this.showErrorMessage(error, error);
                        }
                    }
                    this.ajaxComplete();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (options != undefined && options.type == "POST") {
                        options.error.call(this, errorThrown);
                        console.log(jqXHR.responseText);
                    }
                    this.ajaxComplete();
                }
            });

            return false;
        },

        //send ajax request with data in JSON format and GET verb
        getJson: function (options) {
            var defaultOptions = {
                contentType: this.JSONCONTENTTYPE,
                dataType: this.JSON,
                type: this.GET,
            };
            var ajaxOptions = $.extend({}, defaultOptions, options);
            this.ajax(ajaxOptions);
        },

        //send ajax request with data in JSON format and POST verb
        postJson: function (options) {
            var defaultOptions = {
                contentType: this.JSONCONTENTTYPE,
                dataType: this.JSON,
                type: this.POST,
            };
            var ajaxOptions = $.extend({}, defaultOptions, options);
            this.ajax(ajaxOptions);
        },

        //send ajax request with data in HTML format and GET verb
        getHtml: function (options) {
            var defaultOptions = {
                dataType: this.HTML,
                type: this.GET
            };
            var ajaxOptions = $.extend({}, defaultOptions, options);
            this.ajax(ajaxOptions);
        },

        //send ajax request with data in HTML format and POST verb
        postHtml: function (options) {
            var defaultOptions = {
                dataType: this.HTML,
                type: this.POST
            };
            var ajaxOptions = $.extend({}, defaultOptions, options);
            this.ajax(ajaxOptions);
        },

        //navigate to a url built from controller, action
        redirectToAction: function (options) {
            var url = this.buildUrl(options.controller, options.action);
            if (options.params) {
                if (options.params.length > 0)
                    //options.params.unshift(this.QUESTION_MARK);
                    url = url + this.QUESTION_MARK + options.params.join(this.AND);
            }

            window.location = url;
        }
    });
    Helpers.ajaxHelper = new Helpers.AjaxCore();

    //*************Data Core functions********************************************//
    // Summary: this extension will handle all ultilities for Data
    Helpers.DataCore = Helpers.extend({
        clone: function (source) {
            if (!Helpers.isNull(source)) {
                return $.extend(true, [], source);
            }
            return null;
        },

        serializeJson: function (data) {
            return JSON.stringify(data);
        },

        serializeFormToObject: function (formElement) {
            var o = {};
            var a = formElement.serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        
        sortBy: function (field, reverse, primer) {
            var key = function (x) { return primer ? primer(x[field]) : x[field]; };

            return function(a, b) {
                var A = key(a), B = key(b);
                return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
            };
        },
        
        groupBy: function groupBy(array, funct) {
            var groups = {};
            array.forEach(function (o) {
                var group = JSON.stringify(funct(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function(group) {
                return groups[group];
            });
        },
    });
    Helpers.dataHelper = new Helpers.DataCore();
    
    //*************Data Core functions********************************************//
    // Summary: this extension will handle all ultilities for Data
    Helpers.DateTimeCore = Helpers.extend({
        formatJsonDate: function (jsonDate) {
            if (Helpers.isNullOrEmpty(jsonDate)) {
                return null;
            }
            var re = /-?\d+/;
            var m = re.exec(jsonDate);
            return new Date(parseInt(m[0]));
        }
    });
    Helpers.dateTimeHelper = new Helpers.DateTimeCore();
    
    //*************Style Helper Core functions********************************************//
    Helpers.StyleCore = Helpers.extend({
        options: {
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
            screenSizes: {
                xs: 480,
                sm: 768,
                md: 992,
                lg: 1200
            }
        },
        
        pushMenu: function () {
            var activate = function(toggleBtn) {
                //Get the screen sizes
                var screenSizes = $.AdminLTE.options.screenSizes;

                //Enable sidebar toggle
                $(toggleBtn).on('click', function(e) {
                    e.preventDefault();

                    //Enable sidebar push menu
                    if ($(window).width() > (screenSizes.sm - 1)) {
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
                });

                $(".content-wrapper").click(function() {
                    //Enable hide menu when clicking on the content-wrapper on small screens
                    if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                        $("body").removeClass('sidebar-open');
                    }
                });

                //Enable expand on hover for sidebar mini
                if ($.AdminLTE.options.sidebarExpandOnHover
                    || ($('body').hasClass('fixed')
                        && $('body').hasClass('sidebar-mini'))) {
                    this.expandOnHover();
                }
            };
            return {
                activate: activate,
                expandOnHover: function () {
                    var _this = this;
                    var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
                    //Expand sidebar on hover
                    $('.main-sidebar').hover(function () {
                        if ($('body').hasClass('sidebar-mini')
                                && $("body").hasClass('sidebar-collapse')
                                && $(window).width() > screenWidth) {
                            _this.expand();
                        }
                    }, function () {
                        if ($('body').hasClass('sidebar-mini')
                                && $('body').hasClass('sidebar-expanded-on-hover')
                                && $(window).width() > screenWidth) {
                            _this.collapse();
                        }
                    });
                },
                expand: function () {
                    $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
                },
                collapse: function () {
                    if ($('body').hasClass('sidebar-expanded-on-hover')) {
                        $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
                    }
                }
            };
        }(),
    });
    
    Helpers.styleHelper = new Helpers.StyleCore();

})(jQuery);