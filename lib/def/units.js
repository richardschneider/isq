'use strict';

let config = require('../config'),
    units = {};

units.addUnit = function addSymbol(def, options) {
    options = options || {};
    let
        addPrefixes = typeof options.prefixes === 'undefined' ? true : options.prefixes,
        Q = new config.Quantity();

    //Unit[def.name] = Q;
    units[def.symbol] = Q;
    if (def.base)
        Q.unit = def.base;

    if (addPrefixes) {
        let opts =  Object.assign({}, options, { prefixes: false}),
            prefixes = require('./prefix');

        prefixes.forEach(prefix => {
            let d = Object.assign({}, def);
            d.name = prefix.name + def.name;
            d.symbol = prefix.symbol + def.symbol;
            let u = addSymbol(d, opts);
            u.number = new config.Number(prefix.factor);
            u.unit = def.symbol;
        });

    }

    return Q;
};

// Add the predefined symbols
require('./base').units.forEach(units.addUnit);
require('./derived').forEach(units.addUnit);

module.exports = units;
