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

UncertainNumber.prototype.toString = function() {
    return this.value + ' ± ' + this.uncertainty;
};
UncertainNumber.prototype.plus = function(other) {
    let v = this.value.plus(other),
        u = Math.sqrt(Math.pow(this.uncertainty, 2) + Math.pow(other.uncertainty, 2));
    return new UncertainNumber(v, u);
};

UncertainNumber.prototype.minus = function(other) {
    let v = this.value.minus(other),
        u = Math.sqrt(Math.pow(this.uncertainty, 2) + Math.pow(other.uncertainty, 2));
    return new UncertainNumber(v, u);
};

UncertainNumber.prototype.times = function(other) {
    let v = this.value.times(other),
        u = other.isExact()
            ? this.uncertainty.times(other.abs())
            : v.abs().times(Math.sqrt(Math.pow(this.uncertainty.dividedBy(this.value), 2) + Math.pow(other.uncertainty.dividedBy(other.value), 2)));
    return new UncertainNumber(v, u);
};

UncertainNumber.prototype.dividedBy = function(other) {
    let v = this.value.dividedBy(other),
        u = other.isExact()
            ? this.uncertainty.times(other.abs())
            : v.abs().times(Math.sqrt(Math.pow(this.uncertainty.dividedBy(this.value), 2) + Math.pow(other.uncertainty.dividedBy(other.value), 2)));
    return new UncertainNumber(v, u);
};

function polynomialUncertainty(method, x, n) {
    let v = x.value[method](n),
        u = n.abs().times(x.uncertainty.dividedBy(x.abs())).times(v.abs());
    return new UncertainNumber(v, u);
}

UncertainNumber.prototype.pow = function(other) { return polynomialUncertainty('pow', this, other); };

SINumber.applyStandards(UncertainNumber);

module.exports = UncertainNumber;
