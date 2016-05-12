'use strict';

var SINumber = require('./number');

function UncertainNumber(value, uncertainty) {
    this.value = value;
    this.uncertainty = uncertainty;
}

UncertainNumber.prototype.isExact = function() {
    return typeof this.uncertainty === 'undefined' || this.uncertainty === 0;
};

UncertainNumber.prototype.isUncertain = function() {
    return !this.isExact();
};

UncertainNumber.prototype.valueOf = function() {
    return this.value;
};

SINumber.applyStandards(UncertainNumber);

module.exports = UncertainNumber;
