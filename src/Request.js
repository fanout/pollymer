import TransportTypes from './TransportTypes';
import ErrorTypes from './ErrorTypes';

import Events from './Events';
import { consoleInfo, consoleError } from './ConsoleUtils';

// Global object (window in browsers)

const global = typeof window !== 'undefined' ? window : this;

// Create one instance of an empty method to be used where necessary

const emptyMethod = () => {};

// Utility to determine whether an HTTP code should be treated as an error

const checkForErrorCode = (codesStr, code) => {
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

// Response Header Parsing

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

// JSONP-related utility functions

const jsonpGuid = "D3DDFE2A-6E6D-47A7-8F3B-0A4A8E71A796";

const addJsonpScriptToDom = function (src, scriptId) {
    var script = global.document.createElement("script");
    script.type = "text/javascript";
    script.id = scriptId;
    script.src = src;

    var head = global.document.getElementsByTagName("head")[0];
    head.appendChild(script);
};

const removeJsonpScriptFromDom = function (scriptId) {
    var script = global.document.getElementById(scriptId);
    script.parentNode.removeChild(script);
};

// CORS detection

const corsAvailable = "withCredentials" in new global.XMLHttpRequest();

// Transport Selection

const sameOrigin = function (url) {
    var loc = global.location;
    var a = global.document.createElement('a');
    a.href = url;
    return !a.hostname || (a.hostname == loc.hostname && a.port == loc.port && a.protocol == loc.protocol);
};

const chooseTransport = function (transportType, url) {
    var transport;
    if (transportType == TransportTypes.Auto) {
        if (corsAvailable || sameOrigin(url)) {
            transport = TransportTypes.Xhr;
        } else {
            transport = TransportTypes.Jsonp;
        }
    } else {
        switch (transportType) {
            case TransportTypes.Xhr:
                transport = TransportTypes.Xhr;
                break;
            case TransportTypes.Jsonp:
                transport = TransportTypes.Jsonp;
                break;
            default:
                transport = null;
        }
    }
    return transport;
};

// Pollymer.Request has callback members:
// on('finished', int code, object result, object headers)
// on('error', int reason)

export default class Request {
    constructor() {
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

        this.transport = TransportTypes.Auto;
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
    }
    start(method, url, headers, body) {
        if (this._timer != null) {
            consoleError("pollymer: start() called on a Request object that is currently running.");
            return;
        }

        this._method = method;
        this._url = url;
        this._headers = headers;
        this._body = body;
        this._start();
    }
    _start() {
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
    }
    retry() {
        if (this._tries == 0) {
            consoleError("pollymer: retry() called on a Request object that has never been started.");
            return;
        }
        if (this._timer != null) {
            consoleError("pollymer: retry() called on a Request object that is currently running.");
            return;
        }
        this._retry();
    }
    _retry() {
        if (this._tries === 1) {
            this._retryTime = 1;
        } else if (this._tries < 8) {
            this._retryTime = this._retryTime * 2;
        }

        var delayTime = this._retryTime * 1000;
        delayTime += Math.floor(Math.random() * this.maxDelay);
        consoleInfo("pollymer: trying again in " + delayTime + "ms");

        this._initiate(delayTime);
    }
    _initiate(delayMsecs) {
        var self = this;
        self.lastRequest = null;
        self._timer = setTimeout(function () { self._startConnect(); }, delayMsecs);
    }
    _startConnect() {
        var self = this;
        this._timer = setTimeout(function () { self._timeout(); }, this.timeout);

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
            case TransportTypes.Xhr:
                consoleInfo("pollymer: Using XHR transport.");
                this._xhr = this._startXhr(method, url, headers, body);
                break;
            case TransportTypes.Jsonp:
                consoleInfo("pollymer: Using JSONP transport.");
                this._jsonp = this._startJsonp(method, url, headers, body);
                break;
            default:
                consoleError("pollymer: Invalid transport.");
                break;
        }
    }
    _cleanupConnect(abort) {
        clearTimeout(this._timer);
        this._timer = null;

        switch (this._transport) {
            case TransportTypes.Xhr:
                consoleInfo("pollymer: XHR cleanup");
                this._cleanupXhr(this._xhr, abort);
                this._xhr = null;
                break;
            case TransportTypes.Jsonp:
                consoleInfo("pollymer: json-p " + this._jsonp.id + " cleanup");
                this._cleanupJsonp(this._jsonp, abort);
                this._jsonp = null;
                break;
        }
    }
    abort() {
        this._cleanupConnect(true);
    }
    on(type, handler) {
        return this._events.on(type, handler);
    }
    off(type, handler) {
        this._events.off(type, handler);
    }
    _startXhr(method, url, headers, body) {
        var xhr = new global.XMLHttpRequest();

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
    }
    _cleanupXhr(xhr, abort) {
        if (xhr != null) {
            xhr.onreadystatechange = emptyMethod;
            if (abort) {
                xhr.abort();
            }
        }
    }
    _xhrCallback() {
        var xhr = this._xhr;
        if (xhr != null && xhr.readyState === 4) {
            consoleInfo("pollymer: XHR finished");

            var code = xhr.status;
            var reason = xhr.statusText;
            var headers = parseResponseHeaders(xhr.getAllResponseHeaders());
            var body = xhr.responseText;

            this._handleResponse(code, reason, headers, body);
        }
    }
    _getJsonpCallbacks() {
        // Jsonp mode means we are safe to use window
        // (Jsonp only makes sense in the context of a DOM anyway)
        if (!(jsonpGuid in global)) {
            global[jsonpGuid] = {
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

        return global[jsonpGuid];
    }
    _startJsonp(method, url, headers, body) {
        var jsonpCallbacks = this._getJsonpCallbacks();
        var jsonp = jsonpCallbacks.newCallbackInfo();

        var paramList = [
            "callback=" + encodeURIComponent(`window["${jsonpGuid}"].getJsonpCallback("${jsonp.id}")`)
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
    }
    _cleanupJsonp(jsonp, abort) {
        var jsonpCallbacks = this._getJsonpCallbacks();

        if (jsonp != null) {
            jsonpCallbacks.removeJsonpCallback(jsonp.id);
            removeJsonpScriptFromDom(jsonp.scriptId);
        }
    }
    _jsonpCallback(result) {
        consoleInfo("pollymer: json-p " + this._jsonp.id + " finished");

        var code = ("code" in result) ? result.code : 0;
        var reason = ("reason" in result) ? result.reason : null;
        var headers = ("headers" in result) ? result.headers : {};
        var body = ("body" in result) ? result.body : null;

        this._handleResponse(code, reason, headers, body);
    }
    _handleResponse(code, reason, headers, body) {
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
                this._error(ErrorTypes.TransportError);
            }
        }
    }
    _timeout() {
        this._cleanupConnect(true);

        if (this.maxTries == -1 || this._tries < this.maxTries) {
            this._retry();
        } else {
            this._error(ErrorTypes.TimeoutError);
        }
    }
    _finished(code, result, headers) {
        this._delayNext = true;
        this._events.trigger('finished', this, code, result, headers);
    }
    _error(reason) {
        this._delayNext = true;
        this._events.trigger('error', this, reason);
    }
}
