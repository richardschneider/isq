'use strict';

let config = require('./config'),
    math = require('./math'),
    prefixes = require('./def/prefix'),
    number = require('./number'),
    equals = require('deep-equal'),
    units = {},
    dimensions = {};

var Quantity;  // forward declaration

function numberMaker (number, uncertaintity) {
    let n = new config.Number(number),
        u = new config.Number(uncertaintity),
        un = new config.UncertainNumber(n, u);
    return new Quantity(un);
}

function parse(q, s) {
    let r = new config
        .Expression(s, {
            numberMaker: numberMaker
        })
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
Quantity = function() {
    this.number = new config.UncertainNumber(1);
    this.unit = {};

    if (arguments.length == 1 && typeof arguments[0] === 'string')
        return parse(this, arguments[0]);

    if (arguments.length > 0)
        this.number = arguments[0];
    if (arguments.length > 1)
        this.unit = arguments[1];
 };

/**
 * A human readable representation of the Quantity.
 */
Quantity.prototype.toString = function(options) {
    options = config.options.merge(options);

    // Use the best symbol to represent the Quantity.
    if (options.bestSymbol) {
        let best = Object.keys(Quantity.units)
            .map(key => Quantity.units[key])
            .filter(q => q.symbol && equals(this.unit, q.unit))
            .filter(q => !options.ignoreSymbols.find(prefix => q.name.startsWith(prefix)))
            .map(q => {
                return {
                    order: this.number.abs().minus(q.number.abs()),
                    symbol: q.symbol
                };
            })
            .sort((a,b) => a.order.cmp(b.order))
            .find(q => q.order.gte(0));
        if (best)
            return number.format(this.to(best.symbol), options) + ' ' + best.symbol;
    }

    let units = '';
    for (let prop in this.unit) {
        let exponent = this.unit[prop];
        if (units.length > 0)
            units += ' ';
        if (exponent === 1)
            units += prop;
        else
            units += prop + number.formatExponent(exponent, options);
    }

    return (number.format(this.number, options) + ' ' + units).trim();
};

/**
 * Converts the quantity to a number in another unit.
 *
 * @param {(string)|Quantity} that - The unit to convert to.
 * @returns {UncertainNumber}
 */
Quantity.prototype.to = function(that) {
    if (typeof that === 'string')
        that = new Quantity(that);

    if (!equals(this.unit, that.unit))
        throw new Error('Not the same dimensions');

    return this.dividedBy(that).number;
};

/**
 * Returns true if the numbers and units are the equal.
 */
Quantity.prototype.equals =
Quantity.prototype.eq = function(that) {
    return this.number.eq(that.number) && equals(this.unit, that.unit);
};

/**
 * Returns the number as javascript number, if it is dimensionless.  Otherwise, throws.
 */
Quantity.prototype.toNumber = function() {
    if (Object.keys(this.unit).length === 0)
        return this.number.toNumber();

    throw new Error("The quantity '" + this.toString() + "' can not be transformed into a javascript number");
};


/*
 * Math
 */
Quantity.prototype.valueOf = function() {
    return this.number.valueOf();
};

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
        let v = that.unit[prop].plus(unit[prop] || 0);
        if (v === 0)
            delete unit[prop];
        else
            unit[prop] = v;
    }
    return new Quantity(this.number.times(that.number), unit);
};

Quantity.prototype.dividedBy = function(that) {
    // If dimensionless or a number
    if (!that.unit)
        return new Quantity(this.number.dividedBy(that), this.unit);

    if (!(that instanceof Quantity))
        throw new Error("'" + that + "' is not a quantity or a number");

    let unit = Object.assign({}, this.unit);
    for (let prop in that.unit) {
        let v = (unit[prop] || 0).minus(that.unit[prop]);
        if (v === 0)
            delete unit[prop];
        else
            unit[prop] = v;
    }
    return new Quantity(this.number.dividedBy(that.number), unit);
};

Quantity.prototype.abs = function() {
    return new Quantity(this.number.abs(), this.unit);
};

Quantity.prototype.pow = function(that) {
    let n = that.valueOf(),
        unit = Object.assign({}, this.unit);
    for (let prop in unit) {
        unit[prop] = unit[prop].times(n);
    }
    return new Quantity(this.number.pow(n), unit);
};

Quantity.prototype.sqrt = function() {
    let n = 0.5,  // sqrt() is the same as pow(0.5)
        unit = Object.assign({}, this.unit);
    for (let prop in unit) {
        unit[prop] = unit[prop].times(n);
    }
    return new Quantity(this.number.sqrt(), unit);
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

    if (def.name)
        Q.name = def.name;
    Q.symbol = def.symbol;

    // Add the name and symbol into the defined units.
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
                u.number = Q.number.times(new config.Number(prefix.factor));
                u.unit = Q.unit;
            }
        });

    }

    return Q;
};

/*
 * Get standard math functions.
 */
math.applyNames(Quantity);

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
require('./def/other').forEach(def => {
    units.add(def, {prefixes: false});
});
require('./def/special').forEach(def => {
    units.add(def, {prefixes: false});
});

/*
 * Exports the constructor for a Quantity.
 */
module.exports = Quantity;
