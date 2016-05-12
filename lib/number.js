'use strict';

let config = require('./config');

const siStrict = /^([-+]?[0-9]+([\.\,][0-9]+)?([eE][+-]?[0-9]+)?)([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(\^[-+]?[0-9]+)?(\*\*[-+]?[0-9]+)?(\([0-9]+\))?(%?)$/,
      superscriptMap = {
          '⁰': 0,
          '¹': 1,
          '²': 2,
          '³': 3,
          '⁴': 4,
          '⁵': 5,
          '⁶': 6,
          '⁷': 7,
          '⁸': 8,
          '⁹': 9,
          '⁻': '-',
          '⁺': '+'
      };

function superscriptToInt(s) {
    s = Array.from(s, c => superscriptMap[c]).join('');
    return parseInt(s, 10);
}

function parseNumber(s) {
    // Parse the JS number
    let m = s.match(siStrict);
    if (m === null)
        return NaN;
    let number = m[1].replace(',', '.'),
        exponentU = m[4],
        exponentA = m[5],
        exponentF = m[6],
        uncertainty = m[7],
        isPercentage = m[8] == '%',
        v = Number(number);

    // Apply any SI extensions
    if (isPercentage)
        v = v * 0.01;
    if (exponentU)
        v = Math.pow(v, superscriptToInt(exponentU));
    if (exponentA)
        v = Math.pow(v, Number(exponentA.substr(1)));
    if (exponentF)
        v = Math.pow(v, Number(exponentF.substr(2)));
    if (uncertainty) {
        uncertainty = uncertainty.slice(1, -1);
        let u = number
            .slice(0, -uncertainty.length)
            .replace(/[1-9]/g, '0')
            .concat(uncertainty);
        v = new config.UncertainNumber(v, Number(u));
    }
    return v;
}

/*
 * Force a class to be an SI Number.  In particalar define prototype methods
 * for the standard mathematical operators.
 */

const operators = [
    { symbol: '+', methods: ['plus'], fallback: function(other) { return this + other;} },
    { symbol: '-', methods: ['minus'], fallback: function(other) { return this - other;} },
    { symbol: '*', methods: ['times'], fallback: function(other) { return this * other;} },
    { symbol: '/', methods: ['dividedBy'], fallback: function(other) { return this / other;} },
];


function applyStandardMethods(siNumber) {
    // Add named operators to the class.
    for (let op of operators) {
        let fn = op.fallback;
        let name = op.methods[0];
        if (typeof siNumber.prototype[name] === 'undefined')
            siNumber.prototype[name] = fn;
    }

    // It can be certain or exact.
    if (typeof siNumber.prototype.isUncertain === 'undefined')
        Number.prototype.isUncertain = function() { return false; };
    if (typeof siNumber.prototype.isExact === 'undefined')
        Number.prototype.isExact = function() { return true; };
}

module.exports.parse = (s) => {
    // Ignore spaces
    s = s.replace(/[\u0020\u00A0\u2000-\u200A\u202F\u2005F]/g, '');

    // Allow a number to be multipled by another number
    let result = null;
    for (let text of s.split('×')) {
        let v = parseNumber(text);
        result = result === null ? v : result * v;
    }

    return result;
};

module.exports.applyStandards = applyStandardMethods;

/* Make a Number comply to a SI number */
applyStandardMethods(Number);
