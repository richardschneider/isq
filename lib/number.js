'use strict';

const siStrict = /^([-+]?[0-9]+([\.\,][0-9]+)?)([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(%?)$/,
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
        exponent = m[3],
        isPercentage = m[4] == '%',
        v = Number(number);

    // Apply any SI extensions
    if (isPercentage)
        v = v * 0.01;
    if (exponent)
        v = Math.pow(v, superscriptToInt(exponent));

    return v;
}

exports.parse = (s) => {
    // Ignore spaces
    s = s.replace(/[\u0020\u00A0\u2000-\u200A\u202F\u2005F]/g, '');

    // Allow a number to be multipled by another number
    let result = 1;
    for (let text of s.split('×')) {
        result *= parseNumber(text);
    }

    return result;
};
