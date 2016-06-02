# isq [![Travis build status](https://travis-ci.org/richardschneider/isq.svg)](https://travis-ci.org/richardschneider/isq) [![Coverage Status](https://coveralls.io/repos/github/richardschneider/isq/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/isq?branch=master) [![Documentation Status](http://readthedocs.org/projects/isq/badge/?version=latest)](http://isq.readthedocs.org/en/latest/?badge=latest) [![Gitter](https://badges.gitter.im/richardschneider/isq.svg)](https://gitter.im/richardschneider/isq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A javascript implementation of the International System of Quantities, ISO-80000.

The latest documentation can be read at [Read the Docs](http://isq.readthedocs.org/en/latest/).

### Features

* Uncertainty - `SI.Quantity('123.456(4) km')`
* SI notation - `SI.Quantity('1.234 56(4) × 10² km')`
* ASCII notation - `SI.Quantity('1.234 56(4) x 10^2 km')`
* Conversion - `SI.Quantity('25 m/s').to('km/h')`
* Symbolic expressions - `SI.Quantity('W/(m² sr)')`
* Pluggable - `SI.config.Number = require('big.js')`

## Getting started [![npm version](https://badge.fury.io/js/isq.svg)](https://badge.fury.io/js/isq)

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install isq

## Usage

Include the package

    var SI = require('isq')

Create a number with [SI.Number](http://isq.rtfd.io/en/latest/api/SI#Number)

    var a = SI.Number(0.3),
        b = SI.Number('0.1'),
        c = SI.Number('0.03(1)'), // 0.03±0.01
        d = SI.Number(0.03, 0.01); // same as c

Create a quantity with [SI.Quantity](http://isq.rtfd.io/en/latest/api/SI#Quantity) with an optional number and a unit

    var a = SI.Quantity('1.03 kg'),
        b = SI.Quantity('1.03(1) kg') // 1.03±0.01 kg
        kg = SI.Quantity('kg'); // 1 kg
        
A Quantity is converted to a string with the [toString()](http://isq.rtfd.io/en/latest/api/Quantity#toString) method.  It uses a heuristic to determine the best symbol to use.

    SI.Quantity('5 * 10^-6 s').toString()  // 5 µs
    SI.Quantity('50 000 V/A').toString()   // 50 kΩ

Javascript does not allow overiding of operators, so [named methods](http://isq.readthedocs.io/en/latest/math) are used.  The methods are also chainable.  For example, the hypotenuse of a triangle is

    var a = SI.Quantity('1.2 m'),
        b = SI.Quantity('80 cm'), // 0.8 m
        c = a.pow(2).plus(b.pow(2)).sqrt(); // ~ 1.44 m

# Rounding errors

Rounding and precision errors are [notorious](http://modernweb.com/2014/02/17/what-every-javascript-developer-should-know-about-floating-points/) in Javascript. For example `0.3 - 0.1` produces `0.19999999999999998` and NOT `0.2`. ISQ can be [configured](http://isq.rtfd.io/en/latest/pluggable) to use a 'big number' package that avoids these issues.

    SI.config.Number = require('big.js');
    SI.Number(0.3).minus(SI.Number(0.1)) // 0.2

# Uncertainty

Uncertainity, or margin of error, describes the imperfect nature of a measurement.  Typically, it is the standard deviation of actual measurements. Anytime a calculation is performed, *propagation of uncertainity* is also performed to determine the uncertainty of the result.

    let a = SI.Number('1.2(2)'),   // 1.2±0.2
        b = SI.Number('1.3(3)'),   // 1.3±0.3
        length = a.plus(b);        // 2.5±0.4

When comparing uncertain numbers, the uncertainity of both values is taken into consideration. Equality *Is the difference of the two values within the resulting uncertainty?* 

# License
The [MIT license](LICENSE).

Copyright © 2015-2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=ISQ)
