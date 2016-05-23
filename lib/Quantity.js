'use strict';

let SI = require('..'),
    config = require('./config');

function parse(q, s) {
    let i = s.lastIndexOf(' ');
    q.number = SI.Number(s.substr(0, i));
    q.unit = new config
        .Expression(s.substr(i + 1))
        .resolve(name => {
            let v = SI.units[name];
            if (typeof v === 'undefined')
                throw "Unit '" + name + "' is undefined";
            return v;
        });

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
 * Exports the constructor for a Quantity.
 */
module.exports = Quantity;
