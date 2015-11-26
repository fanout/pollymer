Pollymer
========
Date: May 8th, 2014

Authors:
  * Justin Karneges <justin@fanout.io>
  * Katsuyuki Ohmuro <harmony7@pex2.jp>

Mailing List: http://lists.fanout.io/listinfo.cgi/fanout-users-fanout.io

Pollymer is a general-purpose AJAX library that provides conveniences for long-polling applications, such as request retries, exponential backoff between requests, randomized request delaying, and workarounds for browser "busy" indications. It also implements multiple transports to ensure cross-domain access works in all major browsers.

License
-------

Pollymer is offered under the MIT license. See the COPYING file.

Dependencies
------------

None, but if you need to support a browser that does not natively provide support for JSON (such as IE7 or lower),
then you should use the [json2.js polyfill](https://github.com/douglascrockford/JSON-js).

Available Transports
--------------------

  * XmlHttpRequest - for same-origin requests on all browsers, and cross-origin requests on modern CORS browsers
  * JSON-P - for cross-origin requests on older non-CORS browsers such as IE7, IE8, IE9, and Opera < 12.00

Limitations
-----------

  * If the JSON-P transport is used, the request headers and body are subject to URI length limitations of the browser and server.
  * If the JSON-P transport is used, it may not be possible to inspect all of the response headers. At most, the server may provide "noteworthy" headers within the JSON-P encoding.

Usage
-----

For use in a browser script tag (`Pollymer` becomes a global variable), use the pollymer-1.x.x.min.js file in the dist/ directory.
The non-minified file and sourcemap are also available.

For browserify, use `npm install pollymer`, then `var Pollymer = require('pollymer');`.

For jspm, use 'jspm install github:fanout/pollymer', then `import Pollymer from 'fanout/pollymer';`.

```javascript
var req = new Pollymer.Request();
req.on('finished', function(code, result, headers) { ... });
req.on('error', function(reason) { ... });
var headers = { ... };
var body = 'some data';
req.maxTries = 2; // try twice
req.start('POST', 'http://example.com/path', headers, body);
```

Methods of Request Object
-------------------------

  * on(event_name, callback) - Add callback for event:
    + event_name: name of event
    + callback: method to call when event occurs
    + This method returns a function that can be called to remove this callback from the event.

  * available events:
    + 'finished': function(code, result, headers)
      - code: HTTP status code
      - result: JSON object or string
      - headers: hash of key/value strings
    + 'error': function(reason)
      - reason: Pollymer.errorType

  * off(event_name) - Remove callback for event.
    + Alternatively, call the function that is returned from on().

  * start(method, url, headers, body) - start request
    + method: name of method (e.g. 'GET')
    + url: string url, or function that returns a string url if called
    + headers: hash of key/value strings (optional)
    + body: string body data (optional)
    + Sometime after the request has been started, a finished or error event will be raised and the object will return to inactive state (unless the recurring flag is set, see below).
    + The start method may be called again once the request has completed (unless the recurring flag is set, see below). If called again on the same object, a short random delay will be added before performing the request.

  * retry() - Attempt the exact same request again.
    + Normally, Pollymer will automatically retry a request that it considers to be a failure, but this method may be used if the application needs to retry the request for any another reason. Retries have an exponentially increasing delay between them. Do not use retry() if the previous request attempt was considered to be successful, as it will add penalizing delays that you probably don't want in that case.

  * abort() - Stop any current request.
    + This returns the object to inactive state.

Properties of Request Object
----------------------------

Properties are simple members of the object. They can be set directly:

    req.rawResponse = true;

or passed in a hash during construction:

    var req = new Pollymer.Request({rawResponse: true});

  * rawResponse: boolean. By default, this library will parse response body data as JSON and return an object to the application. Set the rawResponse property to true to disable this behavior and have a string returned instead.

  * maxTries: int. The number of tries a request should be attempted with temporary failure before raising an error event. Set to -1 to indicate infinite attempts. Default is 1.

  * maxDelay: int. The maximum amount of random milliseconds to delay between requests. Default is 1000.

  * recurring: boolean. If set to true, then after a request finishes with a code between 200 and 299, and the finished event has been raised, the same request will be started again. This allows Pollymer to automatically poll a resource endlessly. Pass a function as the url argument in order to be able to change the url between polls.

  * transport: Pollymer.transportType. Explicitly set the transport to use. Default is transportType.Auto, which automatically chooses the best transport when the request is started.

  * withCredentials: boolean. If set to true, and the request will be a cross-origin request performed over an XmlHttpRequest transport using CORS, then the withCredentials flag will be set on the XmlHttpRequest object to be used.  Use this flag if the CORS request needs to have HTTP Cookies and/or HTTP Authentication information sent along with it.

  * timeout: int. Request wait timeout in milliseconds. Default is 60000.

  * errorCodes: string. The error codes and/or ranges that should cause automatic retrying. For example, to have all error codes in the 500-599 range cause an automatic retry except for code 501, you could set errorCodes to '500,502-599'. Default is '500-599'.

Retries
-------

When a request fails at the transport level, or the request succeeds with an error code between 500 and 599, and maxTries has not been reached, then Pollymer will retry the request silently, with an exponentially increasing delay between attempts. In any other case, the request will succeed and the finished event will be raised. If the application determines that the response indicates a temporary error and should be retried with the same backoff delay that Pollymer normally uses, the retry() method may be used.

Request Reuse
-------------

If start() is called on an object that has completed a request and is now inactive, then a random delay will be added before performing the next request. This is ideal behavior when repeatedly polling a resource, so do try to reuse the request object rather than throwing it away and creating a new one every time. When the recurring flag is used, the effect is the same as if you had called start() again yourself after a request finished.

Be sure to recognize the difference between a retry and a reuse of the object. A retry implies that the previous request attempt was a failure, whereas reusing the object means the previous request attempt was successful. This distinction is important because it changes the way the delaying works.

JSON-P Protocol
---------------

This library supports JSON-P by supplying the following query string parameters in the request:

  * callback: the JavaScript function to call in the response script
  * _method: the method name (default GET)
  * _headers: additional headers encoded as JSON (default none)
  * _body: request body (default empty)

This protocol dictates that the presence of the "callback" parameter signifies the request as a JSON-P request. The remaining parameters are optional.

The server is expected to reply with a JSON object with fields:

  * code: the HTTP response status code
  * reason: the HTTP response reason phrase
  * headers: any noteworthy HTTP response headers (default none)
  * body: response body

All fields are required except for "headers". Example response:

    {
      "code": 200,
      "reason": "OK",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": "{ \"foo\": \"bar\" }"
    }
