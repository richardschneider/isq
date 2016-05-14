module.exports = {
    get Number () {
        if (typeof this._Number === 'undefined')
            this.Number = Number;
        return this._Number;
    },
    set Number (v) { this._Number = v; },

    get UncertainNumber () {
        if (typeof this._UncertainNumber === 'undefined')
            this.UncertainNumber = require('./UncertainNumber');
        return this._UncertainNumber;
    },
    set UncertainNumber (v) { this._UncertainNumber = v; }
};
