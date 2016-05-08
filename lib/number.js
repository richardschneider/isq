'use strict';

const siStrict = /^([-+]?[0-9]+([\.\,][0-9]+)?)(%?)$/;

exports.parse = function(s) {
    // Ignore spaces
    s = s.replace(/[\u0020\u00A0\u2000-\u200A\u202F\u2005F]/g, '');

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
};
