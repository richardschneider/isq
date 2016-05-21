'use strict';

let config = require('../config'),
    units = {};

units.addUnit = function addSymbol(def, options) {
    options = options || {};
    let
        addPrefixes = def.symbol == 'kg' ? false : typeof options.prefixes === 'undefined' ? true : options.prefixes,
        Q = new config.Quantity();

    if (options.dontOverride && units[def.symbol])
        return null;

    //Unit[def.name] = Q;
    units[def.symbol] = Q;
    if (def.base)
        Q.unit = def.base;
    if (def.factor)
        Q.number = new config.Number(def.factor);

    if (addPrefixes) {
        let opts =  Object.assign({}, options, { prefixes: false}),
            prefixes = require('./prefix');

        prefixes.forEach(prefix => {
            let d = Object.assign({}, def);
            d.name = prefix.name + def.name;
            d.symbol = prefix.symbol + def.symbol;
            let u = addSymbol(d, opts);
            if (u) {
                u.number = new config.Number(prefix.factor);
                u.unit = def.symbol;
            }
        });

    }

    return Q;
};

// Add the predefined symbols
require('./base').units.forEach(units.addUnit);
require('./derived').forEach(units.addUnit);
units.addUnit({ name: 'gram', symbol: 'g', factor: 0.001, base: 'kg' }, {dontOverride: true});

module.exports = units;
