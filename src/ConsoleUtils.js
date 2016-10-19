let _logger = null;

export function getLogger() {
    return _logger;
}

export function setLogger(value) {
    _logger = value;
}

export function log(type, message) {
    if (_logger != null) {
        _logger(type, message);
    }
}
