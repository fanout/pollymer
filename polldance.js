// don't break if there's no console
if(typeof(console) === "undefined")
{
	console = { log: function() {} };
}

var FO = FO || {};

var fo_jsonp_callback_id = 0;
var fo_jsonp_callbacks = {};

function fo_jsonp_get_callback(cb_id)
{
	if(fo_jsonp_callbacks[cb_id])
	{
		return fo_jsonp_callbacks[cb_id];
	}
	else
	{
		console.log("no callback with id " + cb_id);
		return function(result) {};
	}
}

// FO.Request has onFinished(int code, object result) and onError(int reason) callback members
// error reasons: 0=http, 1=timeout
// note: failed json parse on http body results in empty object {}, not error

FO.Request = function()
{
	if(!(this instanceof FO.Request))
		throw new Error("Constructor called as a function");
}

FO.Request.prototype.start = function(method, url, headers, body)
{
	this._cors = false;
	if("withCredentials" in new XMLHttpRequest())
		this._cors = true;

	var self = this;
	this._timer = setTimeout(function() { self._timeout(); }, 60000);

	if(this._cors)
	{
		this._xhr = new XMLHttpRequest();

		this._xhr.onreadystatechange = function() { self._xhr_readystatechange(); };
		this._xhr.open(method, url, true);

		for(var key in headers)
		{
			if(!headers.hasOwnProperty(key))
				continue;

			this._xhr.setRequestHeader(key, headers[key]);
		}

		this._xhr.send(body);
	}
	else
	{
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");

		script.type = "text/javascript";

		this._cb_id = fo_jsonp_callback_id.toString();
		++fo_jsonp_callback_id;

		this._script_id = "fo-jsonp-script-" + this._cb_id;
		script.id = this._script_id;

		fo_jsonp_callbacks[this._cb_id] = function(result) { self._jsonp_callback(result); };

		var param_list = new Array();

		param_list.push("callback=" + encodeURIComponent("fo_jsonp_get_callback(\"" + this._cb_id + "\")"));
		if(method != "GET")
			param_list.push("method=" + encodeURIComponent(method));
		if(headers)
			param_list.push("headers=" + encodeURIComponent(JSON.stringify(headers)));
		if(body)
			param_list.push("body=" + encodeURIComponent(body));

		var params = param_list.join("&");

		var src;
		if(url.indexOf("?") != -1)
			src = url + "&" + params;
		else
			src = url + "?" + params;

		script.src = src;
		console.log("FO.Request json-p " + this._cb_id + " " + src);
		head.appendChild(script);
	}
}

FO.Request.prototype.abort = function()
{
	clearTimeout(this._timer);
	this._timer = null;

	this._cancelreq();
}

FO.Request.prototype._cancelreq = function()
{
	if(this._cors)
	{
		this._xhr.onreadystatechange = function() {}
		this._xhr.abort();
		this._xhr = null;
	}
	else
	{
		console.log("FO.Request json-p " + this._cb_id + " timeout");

		delete fo_jsonp_callbacks[this._cb_id];
		var script = document.getElementById(this._script_id);
		script.parentNode.removeChild(script);
		this._cb_id = null;
		this._script_id = null;
	}
}

FO.Request.prototype._xhr_readystatechange = function()
{
	if(this._xhr.readyState === 4)
	{
		clearTimeout(this._timer);
		this._timer = null;

		var status = this._xhr.status;
		var responseText = this._xhr.responseText;
		this._xhr = null;

		if(status)
		{
			var result;

			try
			{
				result = JSON.parse(responseText);
			}
			catch(e)
			{
				result = {}
			}

			this._finished(status, result);
		}
		else
			this._error(0);
	}
}

FO.Request.prototype._jsonp_callback = function(result)
{
	console.log("FO.Request json-p " + this._cb_id + " finished");

	clearTimeout(this._timer);
	this._timer = null;

	delete fo_jsonp_callbacks[this._cb_id];
	var script = document.getElementById(this._script_id);
	script.parentNode.removeChild(script);
	this._cb_id = null;
	this._script_id = null;

	this._finished(result.status, result.value);
}

FO.Request.prototype._timeout = function()
{
	this._timer = null;
	this._cancelreq();
	this._error(1);
}

FO.Request.prototype._finished = function(code, result)
{
	if(this.onFinished)
		this.onFinished(code, result);
}

FO.Request.prototype._error = function(reason)
{
	if(this.onError)
		this.onError(reason);
}
