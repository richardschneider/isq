'use strict';

let config = require('./config');

const digitToSuperscript = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
        '-': '⁻',
        '+': '⁺'
      };

let formattingOptions = {
    decimalMark: '.',
    exponentMark: '^',
    powersOf10: true,
    unicodeSuperscript: true
};

var formatExponent; // forward declaration

function format(number, options) {
    options = Object.assign({}, formattingOptions, options);

    // If y is exactly a power of 10, then return '10ⁿ', where 'ⁿ' is log10(y).
    if (options.powersOf10) {
        let n = Math.log10(number.toNumber());
        if (Math.abs(n) >= 3 && n == ~~n)
            return '10' + formatExponent(n, options);
    }

    // Replace 'yEn' with 'y × 10ⁿ'
    number = number.toString();
    number = number.replace(/[eE]([+-]?(\d+))/, (match, p1) => ' × 10' + formatExponent(parseInt(p1), options));

    let parts = number.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (parts.length > 1)
        parts[1] = parts[1].replace(/(\d{3})/g, '$1 ').trim();

    return parts.join(options.decimalMark);
}

formatExponent = function (number, options) {
    options = Object.assign({}, formattingOptions, options);
    let n = format(number, options);

    if (options.unicodeSuperscript)
        return Array.from(n, c => digitToSuperscript[c]).join('');

    return (options.exponentMark || formattingOptions.exponentMark) + n;
};

function numberMaker (number, uncertaintity) {
    let n = new config.Number(number),
        u = new config.Number(uncertaintity);
    if (u.eq(0))
        return n;
    return new config.UncertainNumber(n, u);
}

module.exports.parse = s => {
    // Convert to a standard space.
    s = s.replace(/[\u00A0\u2000-\u200A\u202F\u2005F]/g, ' ');

    // Use the expression parser to give us a number.
    try {
        return new config
            .Expression(s, {
                numberMaker: numberMaker
            })
            .evaluate();
    } catch (e) {
        return NaN;
    }
};

module.exports.format = format;
module.exports.formatExponent = formatExponent;
