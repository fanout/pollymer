if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // native functions don't have a prototype
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}

const global = typeof window !== 'undefined' ? window : this;

const console = global.console || {};

if (console["log"] !== 'function') {
    console["log"] = () => {};
}

if (typeof console["info"] !== 'function') {
    console["info"] = console["log"];
}

if (typeof console["error"] !== 'function') {
    console["error"] = console["log"];
}

export const consoleInfo = console.info.bind(console);
export const consoleError = console.error.bind(console);
