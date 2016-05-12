'use strict';

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

/* A Number is exact and not uncertain */
Number.prototype.isUncertain = function() { return false; };
Number.prototype.isExact = function() { return true; };

module.exports = UncertainNumber;
