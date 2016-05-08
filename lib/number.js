'use strict';

const siStrict = /^([-+]?[0-9]+([\.\,][0-9]+)?)(%?)$/;

function parseNumber(s) {
    // Parse the JS number
    let m = s.match(siStrict);
    if (m === null)
        return NaN;
    let number = m[1].replace(',', '.'),
        isPercentage = m[3] == '%',
        v = Number(number);

    // Apply any SI extensions
    if (isPercentage)
        v = v * 0.01;

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
