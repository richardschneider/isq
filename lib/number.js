'use strict';

const siStrict = /^([-+]?[0-9]+(\.?[0-9]+)?)(%?)$/;

exports.parse = function(s) {
    // Ignore spaces
    s = s.replace(/ /g, '');

    // Parse the JS number
    let m = s.match(siStrict),
        number = m[1],
        isPercentage = m[3] == '%';
    let v = Number(number);

    // Apply any SI extensions
    if (isPercentage)
        v = v * 0.01;

    return v;
};
