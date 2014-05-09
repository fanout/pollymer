/**
 * Pollymer JavaScript Library v1.1.2
 * Copyright 2013-2014 Fanout, Inc.
 * Released under the MIT license (see COPYING file in source distribution)
 */
(function(factory) {
    "use strict";
    var DEBUG = true;
    var isWindow = function(variable) {
        return variable && variable.document && variable.location && variable.alert && variable.setInterval;
    };
    if (!isWindow(window)) {
        throw "The current version of Pollymer may only be used within the context of a browser.";
    }
    var debugMode = DEBUG && typeof(window.console) !== "undefined";
    if (typeof define === 'function' && define['amd']) {
        // AMD anonymous module
        define(['exports'], function(exports) { factory(exports, window, debugMode); });
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window['Pollymer'] = {}, window, debugMode);
    }
})(function(exports, window, debugMode) {

    var emptyMethod = function () { };

    var consoleInfo;
    var consoleError;

    if (debugMode) {
        consoleInfo = window.console.info ?
            function(val) { window.console.info(val); } :
            function(val) { window.console.log(val); }
        consoleError = window.console.error ?
            function(val) { window.console.error(val); } :
            function(val) { window.console.log(val); }
    } else {
        consoleInfo = emptyMethod;
        consoleError = emptyMethod;
    }

    var copyArray = function (array) {
        var args = Array.prototype.slice.call(arguments, 1);
        return Array.prototype.slice.apply(array, args);
    };

    var indexOfItemInArray = function (array, item) {
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    };
    var removeFromArray = function (array, item) {
        var again = true;
        while (again) {
            var index = indexOfItemInArray(array, item);
            if (index != -1) {
                array.splice(index, 1);
            } else {
                again = false;
            }
        }
    };

    var parseResponseHeaders = function (headerStr) {
        var headers = {};
        if (!headerStr) {
            return headers;
        }
        var headerPairs = headerStr.split('\u000d\u000a');
        for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];
            // IE sometimes puts a newline at the start of header names
            if (headerPair[0] == '\u000a') {
                headerPair = headerPair.substring(1);
            }
            var index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                var key = headerPair.substring(0, index);
                headers[key] = headerPair.substring(index + 2);
            }
        }
        return headers;
    };

    var checkForErrorCode = function (codesStr, code) {
        var parts = codesStr.split(',');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var index = part.indexOf('-');
            if (index >= 0) {
                // part is a range
                var min = parseInt(part.substring(0, index), 10);
                var max = parseInt(part.substring(index + 1), 10);
                if (code >= min && code <= max) {
                    return true;
                }
            } else {
                // part is a single value
                var val = parseInt(part, 10);
                if (code == val) {
                    return true;
                }
            }
        }
        return false;
    };

    var addJsonpScriptToDom = function (src, scriptId) {
        var script = window.document.createElement("script");
        script.type = "text/javascript";
        script.id = scriptId;
        script.src = src;

        var head = window.document.getElementsByTagName("head")[0];
        head.appendChild(script);
    };
    var removeJsonpScriptFromDom = function (scriptId) {
        var script = window.document.getElementById(scriptId);
        script.parentNode.removeChild(script);
    };

    var corsAvailable = "withCredentials" in new window.XMLHttpRequest();

    var sameOrigin = function (url) {
        var loc = window.location;
        var a = window.document.createElement('a');
        a.href = url;
        return !a.hostname || (a.hostname == loc.hostname && a.port == loc.port && a.protocol == loc.protocol);
    };

    var chooseTransport = function (transportType, url) {
        var transport;
        if (transportType == transportTypes.Auto) {
            if (corsAvailable || sameOrigin(url)) {
                transport = transportTypes.Xhr;
            } else {
                transport = transportTypes.Jsonp;
            }
        } else {
            switch (transportType) {
            case transportTypes.Xhr:
                transport = transportTypes.Xhr;
                break;
            case transportTypes.Jsonp:
                transport = transportTypes.Jsonp;
                break;
            default:
                transport = null;
            }
        }
        return transport;
    };

    var Events = function () {
        this._events = {};
    };
    Events.prototype._getHandlersForType = function (type) {
        if (!(type in this._events)) {
            this._events[type] = [];
        }
        return this._events[type];
    };
    Events.prototype.on = function (type, handler) {
        var handlers = this._getHandlersForType(type);
        handlers.push(handler);
    };
    Events.prototype.off = function (type) {
        if (arguments.length > 1) {
            var handler = arguments[1];
            var handlers = this._getHandlersForType(type);
            removeFromArray(handlers, handler);
        } else {
            delete this._events[type];
        }
    };
    Events.prototype.trigger = function (type, obj) {
        var args = copyArray(arguments, 2);
        var handlers = copyArray(this._getHandlersForType(type));
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            handler.apply(obj, args);
        }
    };

    var errorTypes = {
        "TransportError": 0,
        "TimeoutError": 1
    };

    var transportTypes = {
        "Auto": 0,
        "Xhr": 1,
        "Jsonp": 2
    };

    // Pollymer.Request has callback members:
    // on('finished', int code, object result, object headers)
    // on('error', int reason)

    var Request = function () {
        if (!(this instanceof Request)) {
            throw new window.Error("Constructor called as a function");
        }

        this._events = new Events();
        this._tries = 0;
        this._delayNext = false;
        this._retryTime = 0;
        this._timer = null;
        this._jsonp = null;

        this._xhr = null;
        this._method = null;
        this._url = null;
        this._headers = null;
        this._body = null;
        this._transport = null;

        this.transport = transportTypes.Auto;
        this.rawResponse = false;
        this.maxTries = 1;
        this.maxDelay = 1000;
        this.recurring = false;
        this.withCredentials = false;
        this.timeout = 60000;
        this.errorCodes = '500-599';

        this.lastRequest = null;

        if (arguments.length > 0) {
            var config = arguments[0];
            if ("transport" in config) {
                this.transport = config.transport;
            }
            if ("rawResponse" in config) {
                this.rawResponse = config.rawResponse;
            }
            if ("maxTries" in config) {
                this.maxTries = config.maxTries;
            }
            if ("maxDelay" in config) {
                this.maxDelay = config.maxDelay;
            }
            if ("recurring" in config) {
                this.recurring = config.recurring;
            }
            if ("withCredentials" in config) {
                this.withCredentials = config.withCredentials;
            }
            if ("timeout" in config) {
                this.timeout = config.timeout;
            }
            if ("errorCodes" in config) {
                this.errorCodes = config.errorCodes;
            }
        }
    };
    Request.prototype.start = function (method, url, headers, body) {
        if (this._timer != null) {
            consoleError("pollymer: start() called on a Request object that is currently running.");
            return;
        }

        this._method = method;
        this._url = url;
        this._headers = headers;
        this._body = body;
        this._start();
    };
    Request.prototype._start = function () {
        this._tries = 0;

        var delayTime;
        if (this._delayNext) {
            this._delayNext = false;
            delayTime = Math.floor(Math.random() * this.maxDelay);
            consoleInfo("pollymer: polling again in " + delayTime + "ms");
        } else {
            delayTime = 0; // always queue the call, to prevent browser "busy"
        }

        this._initiate(delayTime);
    };
    Request.prototype.retry = function () {
        if (this._tries == 0) {
            consoleError("pollymer: retry() called on a Request object that has never been started.");
            return;
        }
        if (this._timer != null) {
            consoleError("pollymer: retry() called on a Request object that is currently running.");
            return;
        }
        this._retry();
    };
    Request.prototype._retry = function () {
        if (this._tries === 1) {
            this._retryTime = 1;
        } else if (this._tries < 8) {
            this._retryTime = this._retryTime * 2;
        }

        var delayTime = this._retryTime * 1000;
        delayTime += Math.floor(Math.random() * this.maxDelay);
        consoleInfo("pollymer: trying again in " + delayTime + "ms");

        this._initiate(delayTime);
    };
    Request.prototype._initiate = function (delayMsecs) {
        var self = this;
        self.lastRequest = null;
        self._timer = window.setTimeout(function () { self._startConnect(); }, delayMsecs);
    };
    Request.prototype._startConnect = function () {
        var self = this;
        this._timer = window.setTimeout(function () { self._timeout(); }, this.timeout);

        this._tries++;

        var method = this._method;
        var url = (typeof (this._url) == "function") ? this._url() : this._url;
        var headers = this._headers;
        var body = this._body;

        // Create a copy of the transport because we don't want
        // to give public access to it (changing it between now and
        // cleanup would be a no-no)
        this._transport = chooseTransport(this.transport, url);

        self.lastRequest = {
            method: method,
            uri: url,
            headers: headers,
            body: body,
            transport: this._transport
        };

        switch (this._transport) {
        case transportTypes.Xhr:
            consoleInfo("pollymer: Using XHR transport.");
            this._xhr = this._startXhr(method, url, headers, body);
            break;
        case transportTypes.Jsonp:
            consoleInfo("pollymer: Using JSONP transport.");
            this._jsonp = this._startJsonp(method, url, headers, body);
            break;
        default:
            consoleError("pollymer: Invalid transport.");
            break;
        }
    };
    Request.prototype._cleanupConnect = function (abort) {
        window.clearTimeout(this._timer);
        this._timer = null;

        switch (this._transport) {
        case transportTypes.Xhr:
            consoleInfo("pollymer: XHR cleanup");
            this._cleanupXhr(this._xhr, abort);
            this._xhr = null;
            break;
        case transportTypes.Jsonp:
            consoleInfo("pollymer: json-p " + this._jsonp.id + " cleanup");
            this._cleanupJsonp(this._jsonp, abort);
            this._jsonp = null;
            break;
        }
    };
    Request.prototype.abort = function () {
        this._cleanupConnect(true);
    };
    Request.prototype.on = function (type, handler) {
        this._events.on(type, handler);
    };
    Request.prototype.off = function (type) {
        var args = copyArray(arguments, 1);
        args.unshift(type);
        this._events.off.apply(this._events, args);
    };
    Request.prototype._startXhr = function (method, url, headers, body) {
        var xhr = new window.XMLHttpRequest();

        // If header has Authorization, and cors is available, then set the
        // withCredentials flag.
        if (this.withCredentials && corsAvailable) {
            xhr.withCredentials = true;
        }

        var self = this;
        xhr.onreadystatechange = function () { self._xhrCallback(); };
        xhr.open(method, url, true);

        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        xhr.send(body);

        consoleInfo("pollymer: XHR start " + url);

        return xhr;
    };
    Request.prototype._cleanupXhr = function (xhr, abort) {
        if (xhr != null) {
            xhr.onreadystatechange = emptyMethod;
            if (abort) {
                xhr.abort();
            }
        }
    };
    Request.prototype._xhrCallback = function () {
        var xhr = this._xhr;
        if (xhr != null && xhr.readyState === 4) {
            consoleInfo("pollymer: XHR finished");

            var code = xhr.status;
            var reason = xhr.statusText;
            var headers = parseResponseHeaders(xhr.getAllResponseHeaders());
            var body = xhr.responseText;

            this._handleResponse(code, reason, headers, body);
        }
    };
    Request.prototype._jsonpGuid = "D3DDFE2A-6E6D-47A7-8F3B-0A4A8E71A796";
    Request.prototype._getJsonpCallbacks = function() {
        // Jsonp mode means we are safe to use window
        // (Jsonp only makes sense in the context of a DOM anyway)
        if (!(this._jsonpGuid in window)) {
            window[this._jsonpGuid] = {
                id: 0,
                requests: {},
                getJsonpCallback: function (id) {
                    var cb;
                    var requests = this.requests;
                    if (id in this.requests) {
                        cb = function (result) { requests[id]._jsonpCallback(result); };
                    } else {
                        consoleInfo("no callback with id " + id);
                        cb = emptyMethod;
                    }
                    return cb;
                },
                addJsonpCallback: function (id, obj) {
                    this.requests[id] = obj;
                },
                removeJsonpCallback: function (id) {
                    delete this.requests[id];
                },
                newCallbackInfo: function () {
                    var callbackInfo = {
                        id: "cb-" + this.id,
                        scriptId: "pd-jsonp-script-" + this.id
                    };
                    this.id++;
                    return callbackInfo;
                }
            };
        }

        return window[this._jsonpGuid];
    };
    Request.prototype._startJsonp = function (method, url, headers, body) {
        var jsonpCallbacks = this._getJsonpCallbacks();
        var jsonp = jsonpCallbacks.newCallbackInfo();

        var paramList = [
            "callback=" + encodeURIComponent("window[\"" + this._jsonpGuid + "\"].getJsonpCallback(\"" + jsonp.id + "\")")
        ];

        if (method != "GET") {
            paramList.push("_method=" + encodeURIComponent(method));
        }
        if (headers) {
            paramList.push("_headers=" + encodeURIComponent(JSON.stringify(headers)));
        }
        if (body) {
            paramList.push("_body=" + encodeURIComponent(body));
        }
        var params = paramList.join("&");

        var src = (url.indexOf("?") != -1) ? url + "&" + params : url + "?" + params;

        jsonpCallbacks.addJsonpCallback(jsonp.id, this);
        addJsonpScriptToDom(src, jsonp.scriptId);

        consoleInfo("pollymer: json-p start " + jsonp.id + " " + src);

        return jsonp;
    };
    Request.prototype._cleanupJsonp = function (jsonp, abort) {
        var jsonpCallbacks = this._getJsonpCallbacks();

        if (jsonp != null) {
            jsonpCallbacks.removeJsonpCallback(jsonp.id);
            removeJsonpScriptFromDom(jsonp.scriptId);
        }
    };
    Request.prototype._jsonpCallback = function (result) {
        consoleInfo("pollymer: json-p " + this._jsonp.id + " finished");

        var code = ("code" in result) ? result.code : 0;
        var reason = ("reason" in result) ? result.reason : null;
        var headers = ("headers" in result) ? result.headers : {};
        var body = ("body" in result) ? result.body : null;

        this._handleResponse(code, reason, headers, body);
    };
    Request.prototype._handleResponse = function (code, reason, headers, body) {
        this._cleanupConnect();

        if ((code == 0 || checkForErrorCode(this.errorCodes, code)) &&
            (this.maxTries == -1 || this._tries < this.maxTries)) {
            this._retry();
        } else {
            if (code > 0) {
                var result;
                if (this.rawResponse) {
                    result = body;
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = body;
                    }
                }
                this._finished(code, result, headers);
                if (this.recurring && code >= 200 && code < 300) {
                    this._start();
                }
            } else {
                this._error(errorTypes.TransportError);
            }
        }
    };
    Request.prototype._timeout = function () {
        this._cleanupConnect(true);

        if (this.maxTries == -1 || this._tries < this.maxTries) {
            this._retry();
        } else {
            this._error(errorTypes.TimeoutError);
        }
    };
    Request.prototype._finished = function (code, result, headers) {
        this._delayNext = true;
        this._events.trigger('finished', this, code, result, headers);
    };
    Request.prototype._error = function (reason) {
        this._delayNext = true;
        this._events.trigger('error', this, reason);
    };

    exports["Request"] = Request;
    exports["TransportTypes"] = transportTypes;
    exports["ErrorTypes"] = errorTypes;
});
