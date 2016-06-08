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

let isq = function createQuantity(s) {
    return new config.Quantity(s);
};

isq.Number = createNumber;
isq.config = config;
isq.isUncertain = isUncertain;
Object.defineProperty(isq, "units", {
    get: function () {
        if (typeof this._units === 'undefined')
            this._units = config.Quantity.units;
        return this._units;
    }
});

module.exports = isq;
