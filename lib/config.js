'use strict';

let math = require('./math');

module.exports = {
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
