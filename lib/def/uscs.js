'use strict';

/**
 *  United States Customary System (see https://en.wikipedia.org/wiki/United_States_customary_units) International definitions.
 */
module.exports = [
    { system: "uscs", quantity: 'length', name: 'inch', symbol: 'in', base: '25.4 mm' },
    { system: "uscs", quantity: 'length', name: 'foot', symbol: 'ft', base: '0.3048 m' },
    { system: "uscs", quantity: 'length', name: 'yard', symbol: 'yd', base: '3 ft' },
    { system: "uscs", quantity: 'length', name: 'mile', symbol: 'mi', base: '5280 ft' },
    { system: "uscs", quantity: 'length', name: 'fathom', symbol: 'ftm', base: '2 yd' },
    { system: "uscs", quantity: 'length', name: 'cable', symbol: 'cb', base: '120 ftm' },

    { system: "uscs", quantity: 'speed', name: 'miles per hour', symbol: 'mph', base: '1 mi/h' },

    //{ system: "uscs", quantity: 'length', name: 'nautical mile', symbol: 'nmi', base: '1.852 km' },
    //{ system: "uscs", quantity: 'length', name: 'nautical mile', symbol: 'NM', base: '1.852 km' },
];

