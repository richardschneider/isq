'use strict';

let config = require('./config');

const
    siStrict = /^([-+]?[0-9]+([\.\,][0-9]+)?([eE][+-]?[0-9]+)?)([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(\^[-+]?[0-9]+)?(\*\*[-+]?[0-9]+)?(\([0-9]+\))?(%?)$/,
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
    },
    digitToSuperscript = {
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

function superscriptToInt(s) {
    s = Array.from(s, c => superscriptMap[c]).join('');
    return parseInt(s, 10);
}

function parseNumber(s) {
    // Parse the JS number
    let m = s.match(siStrict);
    if (m === null) {
        return NaN;
    }

    let number = m[1].replace(',', '.'),
        exponentU = m[4],
        exponentA = m[5],
        exponentF = m[6],
        uncertainty = m[7],
        isPercentage = m[8] == '%',
        v = new config.Number(number);

    // Apply any SI extensions
    if (isPercentage)
        v = v.times(0.01);
    if (exponentU)
        v = v.pow(superscriptToInt(exponentU));
    if (exponentA)
        v = v.pow(Number(exponentA.substr(1)));
    if (exponentF)
        v = v.pow(Number(exponentF.substr(2)));
    if (uncertainty) {
        uncertainty = uncertainty.slice(1, -1);
        let u = number
            .slice(0, -uncertainty.length)
            .replace(/[1-9]/g, '0')
            .concat(uncertainty);
        v = new config.UncertainNumber(v, u);
    }
    return v;
}

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

module.exports.parse = (s) => {
    // Ignore spaces
    s = s.replace(/[\u0020\u00A0\u2000-\u200A\u202F\u2005F]/g, '');

    // Allow a number to be multipled by another number
    let result = null;
    for (let text of s.split(/[×x]/)) {
        let v = parseNumber(text);
        if (Number.isNaN(v)) return NaN;
        result = result === null ? v : result.times(v);
    }

    return result;
};

module.exports.format = format;
module.exports.formatExponent = formatExponent;
