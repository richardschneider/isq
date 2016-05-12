'use strict';

let UncertainNumber = require('./UncertainNumber');

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
        v = new UncertainNumber(v, Number(u));
 //jshint -W053
//        v = new Number(v);
//        v.uncertainty = Number(u);
    }
    return v;
}

exports.parse = (s) => {
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
