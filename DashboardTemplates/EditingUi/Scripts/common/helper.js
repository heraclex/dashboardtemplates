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

})(jQuery);