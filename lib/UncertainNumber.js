'use strict';

function UncertainNumber(value, uncertainty) {
    this.value = value;
    this.uncertainty = uncertainty;
}

/*
 * Various ways of propagating uncertainty.
 */

function additiveUncertainty(fn, a, b) {
    let A = a.value,
        B = b.value || b,
        R = A[fn](B),
        uA = a.uncertainty,
        uB = b.uncertainty || 0,
        uR = uA.pow(2).plus(uB.pow(2)).sqrt();
    return new UncertainNumber(R, uR);
}

function multiplicativeUncertainty(fn, a, b) {
    let A = a.value,
        B = b.value || b,
        R = A[fn](B),
        uA = a.uncertainty,
        uB = b.uncertainty || 0,
        uR = uB === 0
            ? uA.times(B.abs())
            : uA.dividedBy(A).pow(2).plus(uB.dividedBy(B).pow(2)).sqrt().times(R.abs());
    return new UncertainNumber(R, uR);
}

function polynomialUncertainty(fn, x, n) {
    let R = x.value[fn](n),
        uX = x.uncertainty,
        uR = n.abs().times(uX.dividedBy(x.abs())).times(R.abs());
    return new UncertainNumber(R, uR);
}

/*
 * Arithmetic functions that propagate uncertainity.
 */

UncertainNumber.prototype.plus = function(other) { return additiveUncertainty('plus', this, other); };
UncertainNumber.prototype.minus = function(other) { return additiveUncertainty('minus', this, other); };
UncertainNumber.prototype.times = function(other) { return multiplicativeUncertainty('times', this, other); };
UncertainNumber.prototype.dividedBy = function(other) { return multiplicativeUncertainty('dividedBy', this, other); };
UncertainNumber.prototype.pow = function(other) { return polynomialUncertainty('pow', this, other); };
UncertainNumber.prototype.abs = function() {return new UncertainNumber(this.value.abs(), this.uncertainty); };

/*
 * Determine if a 'number' is uncertain.
 */

UncertainNumber.prototype.isExact = function() {
    return typeof this.uncertainty === 'undefined' || this.uncertainty === 0;
};

UncertainNumber.prototype.isUncertain = function() {
    return !this.isExact();
};

/*
 * Some standard Object methods.
 */

UncertainNumber.prototype.valueOf = function() {
    return this.value;
};

UncertainNumber.prototype.toString = function() {
    return this.value + ' ± ' + this.uncertainty;
};

/*
 * Exports the constructor for an UncertainNumber.
 */
module.exports = UncertainNumber;
