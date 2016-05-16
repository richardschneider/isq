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

    // It can be certain or exact.
    if (typeof p.isUncertain === 'undefined')
        p.isUncertain = function() { return false; };
    if (typeof p.isExact === 'undefined')
        p.isExact = function() { return true; };

}

module.exports = {
    applyNames: applyNames,
    operators: operators
};
