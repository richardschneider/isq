'use strict';

let number = require('./lib/number'),
    config = require('./lib/config');

function createNumber() {
    if (arguments.length == 1 && typeof arguments[0] === 'string')
        return number.parse(arguments[0]);

    if (arguments.length == 1 && typeof arguments[0] === 'number')
        return new config.Number(arguments[0]);

    if (arguments.length == 2) {
        let v = createNumber(arguments[0]),
            u = createNumber(arguments[1]);
        return Number.isNaN(v) || Number.isNaN(u)
            ? NaN
            : new config.UncertainNumber(v, u);
    }

    return NaN;
}

function isUncertain(v) {
    return (v.uncertainty || 0).ne(0);
}

module.exports = {
    Number: createNumber,
    config: config,
    isUncertain: isUncertain,
};
