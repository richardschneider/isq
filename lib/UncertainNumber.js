'use strict';

function UncertainNumber(value, uncertainty) {
    this.value = value;
    this.uncertainty = uncertainty;
}

UncertainNumber.prototype.isExact = function() {
    return typeof this.uncertainty === 'undefined' || this.uncertainty === 0;
};

UncertainNumber.prototype.valueOf = function() {
    return this.value;
};

module.exports = UncertainNumber;
