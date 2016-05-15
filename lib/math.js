'use strict';


/*
 * Force a class to be an SI Number.  In particalar define prototype methods
 * for the standard mathematical operators.
 */

const operators = [
    { symbol: '+', methods: ['plus', 'add'], fallback: function(other) { return this + other;} },
    { symbol: '-', methods: ['minus', 'sub', 'subtract'], fallback: function(other) { return this - other;} },
    { symbol: '*', methods: ['times', 'mul', 'mutilply','multiplyBy'], fallback: function(other) { return this * other;} },
    { symbol: '/', methods: ['dividedBy', 'div', 'divide', 'divideBy'], fallback: function(other) { return this / other;} },
    { methods: ['abs'], fallback: function() { return Math.abs(this); } },
    { methods: ['pow'], fallback: function(other) { return Math.pow(this, other); } },
    { methods: ['sqrt'], fallback: function() { return this.pow(0.5); } },
];


function applyNames(siNumber) {
    // Add named operator to the class.
    for (let op of operators) {
        let fn = op.fallback;
        let name = op.methods[0];
        if (typeof siNumber.prototype[name] === 'undefined') {
            console.log(siNumber.name, 'is missing', name);
            siNumber.prototype[name] = fn;
        }
    }

    // It can be certain or exact.
    if (typeof siNumber.prototype.isUncertain === 'undefined')
        Number.prototype.isUncertain = function() { return false; };
    if (typeof siNumber.prototype.isExact === 'undefined')
        Number.prototype.isExact = function() { return true; };
}

module.exports = {
    applyNames: applyNames,
    operators: operators
};
