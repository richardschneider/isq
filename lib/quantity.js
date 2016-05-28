'use strict';

let config = require('./config'),
    prefixes = require('./def/prefix'),
    number = require('./number'),
    equals = require('deep-equal'),
    units = {},    
    dimensions = {};

function parse(q, s) {
    let r = new config
        .Expression(s, { numberMaker: s => { return new Quantity(config.Number(s)); }})
        .resolve(name => {
            let v = units[name];
            if (typeof v === 'undefined')
                throw new Error("Unit '" + name + "' is undefined in expression '" + s + "'");
            return v;
        })
        .evaluate();

    q.number = r.number;
    q.unit = r.unit;

    return q;
}

/**
 * Create an instance of an Quantity.
 */
function Quantity() {
    this.number = 1;
    this.unit = {};

    if (arguments.length == 1 && typeof arguments[0] === 'string')
        return parse(this, arguments[0]);

    if (arguments.length > 0)
        this.number = arguments[0];
    if (arguments.length > 1)
        this.unit = arguments[1];
 }

/**
 * A human readable representation of the Quantity.
 */
Quantity.prototype.toString = function(options) {
    let units = '';
    for (let prop in this.unit) {
        let exponent = this.unit[prop];
        if (units.length > 0)
            units += '⋅';
        if (exponent === 1)
            units += prop;
        else
            units += prop + number.formatExponent(exponent, options);
    }

    return (number.format(this.number, options) + ' ' + units).trim();
};

/**
 * Returns true if the numbers and units are the equal.
 */
Quantity.prototype.equals =
Quantity.prototype.eq = function(that) {
    return this.number.eq(that.number) && equals(this.unit, that.unit);
};

/*
 * Math
 */
Quantity.prototype.plus = function(that) {
    if (!(that instanceof Quantity))
        throw new Error("'" + that + "' is not a quantity");
    if (!equals(this.unit, that.unit))
        throw new Error('Not the same dimensions');

    return new Quantity(this.number.plus(that.number), this.unit);
};

Quantity.prototype.minus = function(that) {
    if (!(that instanceof Quantity))
        throw new Error("'" + that + "' is not a quantity");
    if (!equals(this.unit, that.unit))
        throw new Error('Not the same dimensions');

    return new Quantity(this.number.minus(that.number), this.unit);
};

Quantity.prototype.times = function(that) {
    // If dimensionless or a number
    if (!that.unit)
        return new Quantity(this.number.times(that), this.unit);

    if (!(that instanceof Quantity))
        throw new Error("'" + that + "' is not a quantity or a number");

    let unit = Object.assign({}, this.unit);
    for (let prop in that.unit) {
        let v = that.unit[prop] + (unit[prop] || 0);
        if (v === 0)
            delete unit[prop];
        else
            unit[prop] = v;
    }
    return new Quantity(this.number.times(that.number), unit);
};

Quantity.prototype.dividedBy = function(that) {
    return this.times(that.pow(-1));
};

Quantity.prototype.pow = function(that) {
    let unit = Object.assign({}, this.unit);
    for (let prop in unit) {
        unit[prop] *= that;
    }
    return new Quantity(this.number.pow(that), unit);
};

/**
 * Add a named Quantity.
 */
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
        Q.unit[def.symbol] = 1;
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
    units[def.name] = units[def.symbol] = Q;

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
                u.unit[def.symbol] = 1;
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

// Add the predefined Quantities
require('./def/base').forEach(units.add);
require('./def/derived').forEach(units.add);
units.add({ name: 'gram', symbol: 'g', factor: 0.001, base: 'kg' }, {dontOverride: true});

/*
 * Exports the constructor for a Quantity.
 */
module.exports = Quantity;
