'use strict';

let config = require('./config'),
    prefixes = require('./def/prefix'),
    units = {},    
    dimensions = {};

function parse(q, s) {
    // Do we have a number at the front?
    s = s.trim();
    let first = s[0];
    if (first === '-' || ('0' <= first && first <= '9')) {
        let i = s.lastIndexOf(' ');
        q.number = config.Number(s.substr(0, i));
        s = s.substr(i + 1);
    }

    q.unit = new config
        .Expression(s)
        .resolve(name => {
            let v = units[name];
            if (typeof v === 'undefined')
                throw new Error("Unit '" + name + "' is undefined in expression '" + s + "'");
            return v;
        });

    return q;
}

/**
 * Create an instance of an Quantity.
 */
function Quantity() {
    this.number = 1;
    this.unit = [];

    if (arguments.length == 1 && typeof arguments[0] === 'string')
        return parse(this, arguments[0]);

    if (arguments.length == 2) {
        this.number = arguments[0];
        this.unit = arguments[1];
        return;
    }
 }

units.add = function addSymbol(def, options) {
    options = options || {};
    let
        addPrefixes = def.symbol == 'kg' ? false : typeof options.prefixes === 'undefined' ? true : options.prefixes;

    if (options.dontOverride && units[def.symbol])
        return null;

    // Create the quantity.
    var Q;
    if (def.dimension) {  // a base unit
        Q = new Quantity();
        Q.dimension = dimensions[def.dimension];
    }
    else if (def.base) { // derived unit
        Q = new Quantity(def.base);
    }
    else
        Q = new Quantity();

    Q.name = def.name;
    Q.symbol = def.symbol;
    if (def.factor)
        Q.number = new config.Number(def.factor);
    units[def.symbol] = Q;

    if (addPrefixes) {
        let opts =  Object.assign({}, options, { prefixes: false});

        prefixes.forEach(prefix => {
            let d = {
                name : prefix.name + def.name,
                symbol: prefix.symbol + def.symbol
            };
            let u = addSymbol(d, opts);
            if (u) {
                u.number = new config.Number(prefix.factor);
                u.unit = def.symbol;
            }
        });

    }

    return Q;
};

/**
 * The standard SI dimensions.
 */
Quantity.dimensions = dimensions;
require('./def/dimension').forEach(d => {
    dimensions[d.symbol] = d;
});

/**
 * The standard SI units.
 */
Quantity.units = units;

// Add the predefined symbols
require('./def/base').forEach(units.add);
require('./def/derived').forEach(units.add);
units.add({ name: 'gram', symbol: 'g', factor: 0.001, base: 'kg' }, {dontOverride: true});

/*
 * Exports the constructor for a Quantity.
 */
module.exports = Quantity;
