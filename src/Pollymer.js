import Request from './Request';
import ErrorTypes from './ErrorTypes';
import TransportTypes from './TransportTypes';

import * as consoleUtils from "./ConsoleUtils";

class Pollymer {
    static set logger(value) {
        consoleUtils.setLogger(value);
    }
    static get logger() {
        consoleUtils.getLogger();
    }
}
Pollymer.Request = Request;
Pollymer.ErrorTypes = ErrorTypes;
Pollymer.TransportTypes = TransportTypes;

if (process.env.NODE_ENV === 'development') {
    Pollymer.logger = (type, message) => {
        console.log(`Pollymer: ${type} - ${message}`);
    };
}

export default Pollymer;
