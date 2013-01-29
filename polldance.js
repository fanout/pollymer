(function (window, undefined) {

    var TIMEOUT = 60000;

    // don't break if there's no console
    if (typeof (window.console) === "undefined") {
        window.console = { log: function () { }, dir: function () { } };
    }

    // PollDance.Request has on('finished', int code, object result, object headers) and on('error', int reason) callback members

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
                scriptId: "pd-jsonp-script-" + this.id
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

    var ErrorTypes = {
        "TransportError": 0,
        "TimeoutError": 1
    };

    var TransportTypes = {
        "Auto": 0,
        "Xhr": 1,
        "Jsonp": 2
    };

    var Request = function (config) {
        if (!(this instanceof Request)) {
            throw new Error("Constructor called as a function");
        }

        this._events = new Events();
        this._delayNext = false;

        this.rawResponse = false;
        this.maxTries = 1;
        this.maxDelay = 1000;

        if (config !== undefined) {
            if (config.transport !== undefined)
                this.transport = config.transport;
            if (config.rawResponse !== undefined)
                this.rawResponse = config.rawResponse;
            if (config.maxTries !== undefined)
                this.maxTries = config.maxTries;
            if (config.maxDelay !== undefined)
                this.maxDelay = config.maxDelay;
        }
    };
    Request.prototype.transport = TransportTypes.Auto;
    Request.prototype.start = function (method, url, headers, body) {
        var self = this;

        self._tries = 0;

        var delaytime;
        if (self._delayNext) {
            self._delayNext = false;
            delaytime = Math.floor(Math.random() * self.maxDelay);
            console.log("polling again in " + delaytime + "ms");
        } else {
            delaytime = 0; // always queue the call, to prevent browser "busy"
        }

        self._method = method;
        self._url = url;
        self._headers = headers;
        self._body = body;

        self._timer = setTimeout(function() { self._connect(); }, delaytime);
    };
    Request.prototype._connect = function () {
        var self = this;
        self._timer = window.setTimeout(function () { self._timeout(); }, TIMEOUT);

        ++self._tries;

        if (self.transport == TransportTypes.Auto) {
            if (corsAvailable) {
                self.transport = TransportTypes.Xhr;
            } else {
                self.transport = TransportTypes.Jsonp;
            }
        }

        if (self.transport == TransportTypes.Xhr) {

            self._xhr = new XMLHttpRequest();
            self._xhr.onreadystatechange = function () { self._xhr_readystatechange(); };
            self._xhr.open(self._method, self._url, true);

            for (var key in self._headers) {
                if (self._headers.hasOwnProperty(key)) {
                    self._xhr.setRequestHeader(key, self._headers[key]);
                }
            }

            self._xhr.send(self._body);

            console.log("PollDance.Request start: " + self._url + " " + self._body);

        } else { // Jsonp

            this._callbackInfo = JsonCallbacks.newCallbackInfo();

            var paramList = [];

            paramList.push("_callback=" + encodeURIComponent("PollDance._getJsonpCallback(\"" + this._callbackInfo.id + "\")"));
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
        if (this.transport == TransportTypes.Xhr) {
            this._xhr.onreadystatechange = function () { }
            this._xhr.abort();
            this._xhr = null;
        } else { // Jsonp
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

            if (xhr.status) {
                if (xhr.status >= 500 && xhr.status <= 599 && (this.maxTries == -1 || this._tries < this.maxTries)) {
                    this._retry();
                } else {
                    // TODO: xhr.getAllResponseHeaders()
                    this._handle_response(xhr.status, xhr.statusText, {}, xhr.responseText);
                }
            } else {
                if (this.maxTries == -1 || this._tries < this.maxTries) {
                    this._retry();
                } else {
                    this._error(ErrorTypes.TransportError);
                }
            }
        }
    };
    Request.prototype._jsonp_callback = function (result) {
        console.log("PollDance.Request json-p " + this._callbackInfo.id + " finished");

        window.clearTimeout(this._timer);
        this._timer = null;

        this._removeJsonpCallback(this._callbackInfo);
        this._callbackInfo = null;

        var headers;
        if (result.headers !== undefined) {
            headers = result.headers;
        } else {
            headers = {};
        }

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
            this._error(ErrorTypes.TimeoutError);
        }
    };
    Request.prototype._retry = function() {
        if (this._tries === 1) {
            this._retryTime = 1;
        } else if (this._tries < 8) {
            this._retryTime = this._retryTime * 2;
        }

        var delaytime = this._retryTime * 1000;
        delaytime += Math.floor(Math.random() * self.maxDelay);
        console.log("trying again in " + delaytime + "ms");

        var self = this;
        self._timer = setTimeout(function() { self._connect(); }, delaytime);
    };
    Request.prototype._finished = function (code, result, headers) {
        this._delayNext = true;
        this._events.trigger('finished', this, code, result, headers);
    };
    Request.prototype._error = function (reason) {
        this._delayNext = true;
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
