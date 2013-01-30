/*
 * PollDance JavaScript Library v1.0.0
 * Copyright 2013 Fan Out Networks, Inc.
 * Released under the MIT license (see COPYING file in source distribution)
 */
(function () {
var DEBUG = true;
"use strict";
(function (window, undefined) {

    var NAMESPACE = "PollDance";
    var TIMEOUT = 60000;
    var emptyMethod = function(){};

    var log;
    if (DEBUG) {
        // don't break if there's no console
        if (typeof (window.console) === "undefined") {
            window.console = { log: emptyMethod, dir: emptyMethod };
        }
        log = function(output) { window.console.log(output); };
    } else {
        log = emptyMethod;
    }

    var copyArray = function(array) {
        var args = Array.prototype.slice.call(arguments, 1);
        return Array.prototype.slice.apply(array, args);
    };

    var indexOfItemInArray = function(array, item) {
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

    var jsonCallbacks = {
        id: 0,
        requests: {},
        getJsonpCallback: function (id) {
            var cb;
            var requests = this.requests;
            if (id in this.requests) {
                cb = function (result) { requests[id]._jsonp_callback(result); };
            } else {
                log("no callback with id " + id);
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

    var corsAvailable = "withCredentials" in new window.XMLHttpRequest();

    var sameOrigin = function(url) {
        var loc = window.location;
        var a = window.document.createElement('a');
        a.href = url;
        return !a.hostname || (a.hostname == loc.hostname && a.port == loc.port && a.protocol == loc.protocol);
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

    // PollDance.Request has callback members:
    // on('finished', int code, object result, object headers)
    // on('error', int reason)

    var Request = function () {
        if (!(this instanceof Request)) {
            throw new Error("Constructor called as a function");
        }

        this._events = new Events();
        this._tries = 0;
        this._delayNext = false;
        this._retryTime = 0;
        this._timer = null;
        this._callbackInfo = null;

        this._xhr = null;
        this._method = null;
        this._url = null;
        this._headers = null;
        this._body = null;

        this.transport = transportTypes.Auto;
        this.rawResponse = false;
        this.maxTries = 1;
        this.maxDelay = 1000;

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
        }
    };
    Request.prototype.start = function (method, url, headers, body) {
        var self = this;

        self._tries = 0;

        var delaytime;
        if (self._delayNext) {
            self._delayNext = false;
            delaytime = Math.floor(Math.random() * self.maxDelay);
            log("PD: polling again in " + delaytime + "ms");
        } else {
            delaytime = 0; // always queue the call, to prevent browser "busy"
        }

        self._method = method;
        self._url = url;
        self._headers = headers;
        self._body = body;

        self._timer = window.setTimeout(function () { self._connect(); }, delaytime);
    };
    Request.prototype.retry = function () {
        this._retry();
    };
    Request.prototype._connect = function () {
        var self = this;
        self._timer = window.setTimeout(function () { self._timeout(); }, TIMEOUT);

        self._tries++;

        if (self.transport == transportTypes.Auto) {
            if (corsAvailable || sameOrigin(self._url)) {
                self.transport = transportTypes.Xhr;
            } else {
                self.transport = transportTypes.Jsonp;
            }
        }

        if (self.transport == transportTypes.Xhr) {

            self._xhr = new window.XMLHttpRequest();
            self._xhr.onreadystatechange = function () { self._xhr_readystatechange(); };
            self._xhr.open(self._method, self._url, true);

            for (var key in self._headers) {
                if (self._headers.hasOwnProperty(key)) {
                    self._xhr.setRequestHeader(key, self._headers[key]);
                }
            }

            self._xhr.send(self._body);

            log("PD: xhr " + self._url + " " + self._body);

        } else { // Jsonp

            this._callbackInfo = jsonCallbacks.newCallbackInfo();

            var paramList = [];

            paramList.push("_callback=" + encodeURIComponent("window['" + NAMESPACE + "']._getJsonpCallback(\"" + this._callbackInfo.id + "\")"));
            if (self._method != "GET") {
                paramList.push("_method=" + encodeURIComponent(self._method));
            }
            if (self._headers) {
                paramList.push("_headers=" + encodeURIComponent(JSON.stringify(self._headers)));
            }
            if (self._body) {
                paramList.push("_body=" + encodeURIComponent(self._body));
            }
            var params = paramList.join("&");

            var src;
            if (self._url.indexOf("?") != -1) {
                src = self._url + "&" + params;
            } else {
                src = self._url + "?" + params;
            }

            log("PD: json-p " + this._callbackInfo.id + " " + src);
            this._addJsonpCallback(this._callbackInfo, src);
        }
    };
    Request.prototype.abort = function () {
        window.clearTimeout(this._timer);
        this._timer = null;
        this._cancelreq();
    };
    Request.prototype.on = function (type, handler) {
        this._events.on(type, handler);
    };
    Request.prototype.off = function (type) {
        var args = copyArray(arguments, 1).unshift(type);
        this._events.off.apply(this._events, args);
    };
    Request.prototype._addJsonpCallback = function (callbackInfo, src) {
        jsonCallbacks.addJsonpCallback(callbackInfo.id, this);

        var script = window.document.createElement("script");
        script.type = "text/javascript";
        script.id = callbackInfo.scriptId;
        script.src = src;

        var head = window.document.getElementsByTagName("head")[0];
        head.appendChild(script);
    };
    Request.prototype._removeJsonpCallback = function (callbackInfo) {
        jsonCallbacks.removeJsonpCallback(callbackInfo.id, this);

        var script = window.document.getElementById(callbackInfo.scriptId);
        script.parentNode.removeChild(script);
    };
    Request.prototype._cancelreq = function () {
        if (this.transport == transportTypes.Xhr) {
            this._xhr.onreadystatechange = emptyMethod;
            this._xhr.abort();
            this._xhr = null;
        } else { // Jsonp
            log("PD: json-p " + this._callbackInfo.id + " cancel");
            this._removeJsonpCallback(this._callbackInfo);
            this._callbackInfo = null;
        }
    };
    Request.prototype._xhr_readystatechange = function () {
        var xhr = this._xhr;
        if (xhr != null && xhr.readyState === 4) {
            this._xhr = null;

            window.clearTimeout(this._timer);
            this._timer = null;

            if ((!xhr.status || (xhr.status >= 500 && xhr.status < 600)) &&
                (this.maxTries == -1 || this._tries < this.maxTries)) {
                this._retry();
            } else {
                if (xhr.status) {
                    // TODO: xhr.getAllResponseHeaders()
                    this._handle_response(xhr.status, xhr.statusText, {}, xhr.responseText);
                } else {
                    this._error(errorTypes.TransportError);
                }
            }
        }
    };
    Request.prototype._jsonp_callback = function (result) {
        log("PD: json-p " + this._callbackInfo.id + " finished");

        window.clearTimeout(this._timer);
        this._timer = null;

        this._removeJsonpCallback(this._callbackInfo);
        this._callbackInfo = null;

        var headers = ("headers" in result) ? result.headers : {};
        this._handle_response(result.code, result.status, headers, result.body);
    };
    Request.prototype._handle_response = function (code, status, headers, body) {
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
    };
    Request.prototype._timeout = function () {
        this._timer = null;
        this._cancelreq();

        if (this.maxTries == -1 || this._tries < this.maxTries) {
            this._retry();
        } else {
            this._error(errorTypes.TimeoutError);
        }
    };
    Request.prototype._retry = function () {
        if (this._tries === 1) {
            this._retryTime = 1;
        } else if (this._tries < 8) {
            this._retryTime = this._retryTime * 2;
        }

        var delaytime = this._retryTime * 1000;
        delaytime += Math.floor(Math.random() * this.maxDelay);
        log("PD: trying again in " + delaytime + "ms");

        var self = this;
        self._timer = window.setTimeout(function () { self._connect(); }, delaytime);
    };
    Request.prototype._finished = function (code, result, headers) {
        this._delayNext = true;
        this._events.trigger('finished', this, code, result, headers);
    };
    Request.prototype._error = function (reason) {
        this._delayNext = true;
        this._events.trigger('error', this, reason);
    };

    var exports = {
        Request: Request,
        TransportTypes: transportTypes,
        ErrorTypes: errorTypes,
        _getJsonpCallback: function (id) {
            return jsonCallbacks.getJsonpCallback(id);
        }
    };
    window[NAMESPACE] = window[NAMESPACE] || exports;

})(window);
})();
