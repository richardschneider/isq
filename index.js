'use strict';

let number = require('./lib/number'),
    config = require('./lib/config');

function createNumber() {
    if (typeof arguments[0] === 'string')
        return number.parse(arguments[0]);

    if (arguments.length == 1 && typeof arguments[0] === 'number')
        return new config.Number(arguments[0]);

    if (arguments.length == 2)
        return new config.UncertainNumber(createNumber(arguments[0]), createNumber(arguments[1]));

    return NaN;
}

module.exports = {
    Number: createNumber,
    config: config
};
