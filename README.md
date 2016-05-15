# isq [![Travis build status](https://travis-ci.org/richardschneider/isq.svg)](https://travis-ci.org/richardschneider/isq) [![Coverage Status](https://coveralls.io/repos/github/richardschneider/isq/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/isq?branch=master) [![Documentation Status](http://readthedocs.org/projects/isq/badge/?version=latest)](http://isq.readthedocs.org/en/latest/?badge=latest)

A javascript implementation of the International System of Quantities, ISO-80000.

The latest documentation can be read at [Read the Docs](http://isq.readthedocs.org/en/latest/)

### Features
* Uncertainty - `SI.Number('123.456(4)')`
* SI notation - `SI.Number('1.234 56(4) × 10²')`
* Arbitrary-precision decimal and non-decimal arithmetic - `SI.config.Number = require('BigNumber')`

## Getting started [![npm version](https://badge.fury.io/js/isq.svg)](https://badge.fury.io/js/isq)

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install isq

## Usage

Include the package

        var SI = require('isq')

Create a number with [SI.Number()]()

        var a = SI.Number(0.3),
            b = SI.Number('0.1'),
            c = SI.Number('0.03(1)'), // 0.03±0.01
            d = SI.Number(0.03, 0.01); // same as c

Javascript does not allow overiding of operators, so [named methods]() are used.  The methods are also chainable.  For example the hypotenuse of a triangle is

        var c = a.pow(2).plus(b.pow(2)).sqrt()

# Rounding errors

# Uncertainty

# License
The [MIT license](LICENSE).

Copyright © 2016 Richard Schneider (makaretu@gmail.com)

Copyright © 2015-2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=ISQ)
