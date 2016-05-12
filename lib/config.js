module.exports = {
    get UncertainNumber () {
        if (typeof this._UncertainNumber === 'undefined')
            this.UncertainNumber = require('./UncertainNumber');
        return this._UncertainNumber;
    },
    set UncertainNumber (v) { this._UncertainNumber = v; }
};
