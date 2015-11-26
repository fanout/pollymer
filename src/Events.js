export default class Events {
    constructor() {
        this._events = new Map();
    }
    on(type, handler) {
        var currentHandlers = this._events.get(type) || [];
        var handlers = currentHandlers.concat([handler]);
        this._events.set(type, handlers);
        return () => this.off(type, handler);
    }
    off(type, handler) {
        if (typeof handler !== "undefined") {
            if (this._events.has(type)) {
                var currentHandlers = this._events.get(type);
                this._events.set(type, currentHandlers.filter(item => item !== handler));
            }
        } else {
            this._events.delete(type);
        }
    }
    trigger(type, obj, ...args) {
        if (this._events.has(type)) {
            this._events.get(type).forEach(handler => handler.call(obj, ...args));
        }
    }
}
