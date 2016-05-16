'use strict';

/*
 * Force a class to be an SI Number.  In particalar define prototype methods
 * for the standard mathematical operators.
 */

function compare(a, b) {
    let D = a - b;
    return D === 0 ? 0 : D <= 0 ? -1 : 1;
}

const operators = [
    { symbol: '+', methods: ['plus', 'add'], fallback: function(other) { return this + other;} },
    { symbol: '-', methods: ['minus', 'sub', 'subtract'], fallback: function(other) { return this - other;} },
    { symbol: '*', methods: ['times', 'mul', 'mutilply','multiplyBy'], fallback: function(other) { return this * other;} },
    { symbol: '/', methods: ['dividedBy', 'div', 'divide', 'divideBy'], fallback: function(other) { return this / other;} },
    { methods: ['abs'], fallback: function() { return Math.abs(this); } },
    { methods: ['pow'], fallback: function(other) { return Math.pow(this, other); } },
    { methods: ['sqrt'], fallback: function() { return this.pow(0.5); } },
    { methods: ['cmp', 'compare', 'comparesTo'], fallback: function(other) { return compare(this, other); } },
    { symbol: '==', methods: ['eq', 'equal', 'equals', 'eql', 'equalTo'],
      fallback: function(other) { return this.cmp(other) === 0; } },
    { symbol: '!=', methods: ['ne', 'notEqual', 'notEquals', 'notEqualTo'],
      fallback: function(other) { return !this.eq(other); } },
    { symbol: '<', methods: ['lt', 'lessThan',],
      fallback: function(other) { return this.cmp(other) < 0; } },
    { symbol: '<=', methods: ['lte', 'lessThanOrEqual',],
      fallback: function(other) { return this.cmp(other) <= 0; } },
    { symbol: '>', methods: ['gt', 'greaterThan',],
      fallback: function(other) { return this.cmp(other) > 0; } },
    { symbol: '>=', methods: ['gte', 'greaterThanOrEqual',],
      fallback: function(other) { return this.cmp(other) >= 0; } },
];


function applyNames(siNumber) {
    // Add named operator to the class.
    let p = siNumber.prototype,
        hasMethod = m => p[m];

    for (let op of operators) {
        let name = op.methods[0];

        // Already has the named method?
        if (hasMethod(name))
            continue;

        // Has an alias to the named method?
        let alias = op.methods.find(hasMethod);
        if (alias) {
            console.log(siNumber.name + '.' + name, '=', alias);
            p[name] = p[alias];
            continue;
        }

        // Use the fallback function.
        console.log(siNumber.name, 'is missing', name);
        p[name] = op.fallback;
    }
}

module.exports = {
    applyNames: applyNames,
    operators: operators
};
