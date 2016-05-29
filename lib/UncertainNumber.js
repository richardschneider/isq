'use strict';

function mustBeNumber(v) {
    if (isNaN(v))
        throw new Error('Must be a number, not NaN');
    
    return v;
}

function UncertainNumber(value, uncertainty) {
    this.value = mustBeNumber(value);
    this.uncertainty = mustBeNumber(uncertainty);
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

function polynomialUncertainty(fn, a, b) {
    let A = a.value,
        B = b.value || b,
        R = A[fn](B),
        uA = a.uncertainty,
        uB = b.uncertainty || 0,
        uR = B.abs().times(uA.dividedBy(A.abs())).times(R.abs());
    
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
 * Some standard Object methods.
 */

UncertainNumber.prototype.valueOf = function() {
    return this.value;
};

UncertainNumber.prototype.toString = function() {
    if (this.uncertainty === 0)
        return this.value.toString();
    
    return this.value + ' ± ' + this.uncertainty;
};

/*
 * Comparision
 */
UncertainNumber.prototype.cmp = function(other) {
    let D = this.minus(other);
    if (D.value.abs().lte(D.uncertainty))
        return 0;
    return D.value.cmp(0);
};

/*
 * Exports the constructor for an UncertainNumber.
 */
module.exports = UncertainNumber;
