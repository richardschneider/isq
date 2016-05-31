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
    unicodeSuperscript: true
};

function format(number) {
    return number.toString();
}

function formatExponent(number, options) {
    options = options || formattingOptions;
    let n = format(number, options);

    if (options.unicodeSuperscript)
        return Array.from(n, c => digitToSuperscript[c]).join('');

    return (options.exponentMark || formattingOptions.exponentMark) + n;
}

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
