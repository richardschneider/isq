'use strict';

let number = require('./number');

function parse(q, s) {
    let i = s.lastIndexOf(' ');
    q.number = number.parse(s.substr(0, i));
    q.unit = s.substr(i + 1);

    return q;
}

function Quantity() {
    if (arguments.length == 1 && typeof arguments[0] === 'string')
        return parse(this, arguments[0]);

    if (arguments.length == 2) {
        this.number = arguments[0];
        this.unit = arguments[1];
        return;
    }
}

/*
 * Exports the constructor for an UncertainNumber.
 */
module.exports = Quantity;
