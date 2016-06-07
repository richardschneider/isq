'use strict';

let math = require('./math');

/**
 * The default options.
 */
let options = {
    // Expression
    implicitMultiplication: true,
    digitGroupSeparator: ' ',
    leadingDigit: true,

    // Number
    decimalMark: '.',
    exponentMark: '^',
    powersOf10: true,
    unicodeSuperscript: true,
    minDigitsForSeparation: 5,

    // Quantity
    bestSymbol: true,
    ignoreSymbols: ['deca', 'hecto', 'deci'],
};

options.merge = (other) => Object.assign({}, options, other);

module.exports = {
    options: options,

    get Number () {
        if (typeof this._Number === 'undefined')
            this.Number = Number;
        return this._Number;
    },
    set Number (v) {
        math.applyNames(v);
        this._Number = v;
    },

    get UncertainNumber () {
        if (typeof this._UncertainNumber === 'undefined')
            this.UncertainNumber = require('./UncertainNumber');
        return this._UncertainNumber;
    },
    set UncertainNumber (v) {
        math.applyNames(v);
        this._UncertainNumber = v;
    },

    get Quantity () {
        if (typeof this._Quantity === 'undefined')
            this.Quantity = require('./quantity');
        return this._Quantity;
    },
    set Quantity (v) {
        math.applyNames(v);
        this._Quantity = v;
    },

    get Expression () {
        if (typeof this._Expression === 'undefined')
            this.Expression = require('./expression');
        return this._Expression;
    },
    set Expression (v) {
        this._Expression = v;
    },
};
