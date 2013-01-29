(function (window, undefined) {

    var TIMEOUT = 60000;

    // don't break if there's no console
    if (typeof (window.console) === "undefined") {
        window.console = { log: function () { }, dir: function () { } };
    }

    // PollDance.Request has on('finished', int code, object result) and on('error', int reason) callback members
    // error reasons: 0=http, 1=timeout
    // note: failed json parse on http body results in empty object {}, not error

    var JsonCallbacks = {
        id: 0,
        requests: {},
        emptyCallback: function() {},
        getJsonpCallback: function (id) {
            var cb;
            var requests = this.requests;
            if (id in this.requests) {
                cb = function (result) { requests[id]._jsonp_callback(result); };
            } else {
                console.log("no callback with id " + id);
                cb = this.emptyCallback;
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
                scriptId: "fo-jsonp-script-" + this.id
            };
            this.id++;
            return callbackInfo;
        }
    };

    var corsAvailable = "withCredentials" in new XMLHttpRequest();

    var Events = function () {
        this._events = {};
    };
    Events.prototype._getEventsForType = function (type) {
        if (!(type in this._events)) {
            this._events[type] = [];
        }
        return this._events[type];
    };
    Events.prototype._setEventsForType = function (type, events) {
        this._events[type] = events;
    };
    Events.prototype.on = function (type, handler) {
        var events = this._getEventsForType(type);
        events.push(handler);
    };
    Events.prototype.off = function (type) {
        if (arguments.length > 1) {
            var events = this._getEventsForType(type);
            var handlersToKeep = [];
            var handlers = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var keep = true;
                for (var j = 0; j < handlers.length; j++) {
                    var handler = handlers[j];
                    if (event == handler) {
                        keep = false;
                    }
                }
                if (keep) {
                    handlersToKeep.push(event);
                }
            }
            this._setEventsForType(type, handlersToKeep);
        } else {
            delete this._events[type];
        }

    };
    Events.prototype.trigger = function (type, obj) {
        var args = Array.prototype.slice.call(arguments, 2);
        var events = this._getEventsForType(type);
        for (var i = 0; i < events.length; i++) {
            var handler = events[i];
            handler.apply(obj, args);
        }
    };

    var TransportTypes = {
        "Auto": 0,
        "Xhr": 1,
        "Xdr": 2,
        "Jsonp": 3
    };

    var Request = function () {
        if (!(this instanceof Request)) {
            throw new Error("Constructor called as a function");
        }
        this._events = new Events();
    };
    Request.prototype.transport = TransportTypes.Auto;
    Request.prototype.start = function (method, url, headers, body) {
        var self = this;
        self._timer = window.setTimeout(function () { self._timeout(); }, TIMEOUT);

        if (corsAvailable) {

            self._xhr = new XMLHttpRequest();
            self._xhr.onreadystatechange = function () { self._xhr_readystatechange(); };
            self._xhr.open(method, url, true);

            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    self._xhr.setRequestHeader(key, headers[key]);
                }
            }

            self._xhr.send(body);

            console.log("PollDance.Request start: " + url + " " + body);

        } else {

            this._callbackInfo = JsonCallbacks.newCallbackInfo();

            var paramList = [];

            paramList.push("callback=" + encodeURIComponent("PollDance._getJsonpCallback(\"" + this._callbackInfo.id + "\")"));
            if (method != "GET") {
                paramList.push("method=" + encodeURIComponent(method));
            }
            if (headers) {
                paramList.push("headers=" + encodeURIComponent(JSON.stringify(headers)));
            }
            if (body) {
                paramList.push("body=" + encodeURIComponent(body));
            }
            var params = paramList.join("&");

            var src;
            if (url.indexOf("?") != -1) {
                src = url + "&" + params;
            } else {
                src = url + "?" + params;
            }

            console.log("PollDance.Request json-p " + this._callbackInfo.id + " " + src);
            this._addJsonpCallback(this._callbackInfo, src);
        }
    };
    Request.prototype.abort = function () {
        clearTimeout(this._timer);
        this._timer = null;
        this._cancelreq();
    };
    Request.prototype.on = function (type, handler) {
        this._events.on(type, handler);
    };
    Request.prototype.off = function (type) {
        var args = Array.prototype.slice.call(arguments);
        this._events.off.apply(this._events, args);
    };
    Request.prototype._addJsonpCallback = function (callbackInfo, src) {
        JsonCallbacks.addJsonpCallback(callbackInfo.id, this);

        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = callbackInfo.scriptId;
        script.src = src;
        head.appendChild(script);
    };
    Request.prototype._removeJsonpCallback = function (callbackInfo) {
        JsonCallbacks.removeJsonpCallback(callbackInfo.id, this);

        var script = document.getElementById(callbackInfo.scriptId);
        script.parentNode.removeChild(script);
    };
    Request.prototype._cancelreq = function () {
        if (corsAvailable) {
            this._xhr.onreadystatechange = function () { }
            this._xhr.abort();
            this._xhr = null;
        } else {
            console.log("PollDance.Request json-p " + this._callbackInfo.id + " cancel");
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

            var status = xhr.status;

            if (status) {
                var result;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = {};
                }
                this._finished(status, result);
            } else {
                this._error(0);
            }
        }
    };
    Request.prototype._jsonp_callback = function (result) {
        console.log("PollDance.Request json-p " + this._callbackInfo.id + " finished");

        window.clearTimeout(this._timer);
        this._timer = null;

        this._removeJsonpCallback(this._callbackInfo);
        this._callbackInfo = null;

        this._finished(result.status, result.value);
    };
    Request.prototype._timeout = function () {
        this._timer = null;
        this._cancelreq();
        this._error(1);
    };
    Request.prototype._finished = function (code, result) {
        this._events.trigger('finished', this, code, result);
    };
    Request.prototype._error = function (reason) {
        this._events.trigger('error', this, reason);
    };

    var pollDance = {
        Request: Request,
        _getJsonpCallback: function (id) {
            return JsonCallbacks.getJsonpCallback(id);
        }
    };

    window.PollDance = window.PollDance || pollDance;

})(window);
