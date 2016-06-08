# isq 

[![Travis build status](https://travis-ci.org/richardschneider/isq.svg)](https://travis-ci.org/richardschneider/isq) [![Coverage Status](https://coveralls.io/repos/github/richardschneider/isq/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/isq?branch=master) 

 [![npm version](https://badge.fury.io/js/isq.svg)](https://badge.fury.io/js/isq) [![Documentation Status](http://readthedocs.org/projects/isq/badge/?version=latest)](http://isq.readthedocs.org/en/latest/?badge=latest) [![Gitter](https://badges.gitter.im/richardschneider/isq.svg)](https://gitter.im/richardschneider/isq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A javascript implementation of the International System of Quantities, [ISO-80000](https://en.wikipedia.org/wiki/ISO/IEC_80000).

The latest documentation can be read at [Read the Docs](http://isq.readthedocs.org/en/latest/).  The release history and change notes are on [github](https://github.com/richardschneider/isq/releases).

### Features

* Uncertainty - `isq('123.456(4) km')`
* SI notation - `isq('1.234 56(4) × 10² km')`
* ASCII notation - `isq('1.234 56(4) x 10^2 km')`
* Conversion - `isq('25 m/s').to('km/h')`
* Symbolic expressions - `isq('W/(m² sr)')`
* Pluggable - `isq.config.Number = require('big.js')`

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install isq

## Usage

Include the package

    var isq = require('isq')

Create a quantity with the function returned by the [isq module](http://isq.rtfd.io/en/latest/api/isq)

    var a = isq('1.03 kg'),
        b = isq('1.03(1) kg') // 1.03±0.01 kg
        kg = isq('kg'); // 1 kg
        
A Quantity is converted to a string with the [toString()](http://isq.rtfd.io/en/latest/api/Quantity#toString) method.  It uses a heuristic to determine the best symbol to use.

    isq('5 * 10^-6 s').toString()  // 5 µs
    isq('50 000 V/A').toString()   // 50 kΩ

Javascript does not allow overiding of operators, so [named methods](http://isq.readthedocs.io/en/latest/math) are used.  The methods are also chainable.  For example, the hypotenuse of a triangle is

    var a = isq('1.2 m'),
        b = isq('80 cm'), // 0.8 m
        c = a.pow(2).plus(b.pow(2)).sqrt(); // ~ 1.44 m

## Numbers

Create a number with [isq.Number](http://isq.rtfd.io/en/latest/api/SI#Number)

    var a = isq.Number(0.3),
        b = isq.Number('0.1'),
        c = isq.Number('0.03(1)'), // 0.03±0.01
        d = isq.Number(0.03, 0.01); // same as c

It is most likely easier to just create a unitless Quantity, as in:

    var c = isq('0.03(1)');     // 0.03±0.01
    
### Rounding errors

Rounding and precision errors are [notorious](http://modernweb.com/2014/02/17/what-every-javascript-developer-should-know-about-floating-points/) in Javascript. For example `0.3 - 0.1` produces `0.19999999999999998` and NOT `0.2`. ISQ can be [configured](http://isq.rtfd.io/en/latest/pluggable) to use a 'big number' package that avoids these issues.

    isq.config.Number = require('big.js');
    isq.Number(0.3).minus(isq.Number(0.1)) // 0.2

### Uncertainty

Uncertainity, or margin of error, describes the imperfect nature of a measurement.  Typically, it is the standard deviation of actual measurements. Anytime a calculation is performed, *propagation of uncertainity* is also performed to determine the uncertainty of the result.

    let a = isq('1.2(2) m'),   // 1.2±0.2 m
        b = isq('1.3(3) m'),   // 1.3±0.3 m
        length = a.plus(b);    // 2.5±0.4 m

When comparing uncertain numbers, the uncertainity of both values is taken into consideration. Equality *Is the difference of the two values within the resulting uncertainty?* 

# Command line

A command line interface (`isq`) is also available. Type `isq --help` for the most current usage.

````
  Usage: isq [options] expression

  SI quantities

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -b, --base          output in SI base units
    --to <unit>         convert to another unit
    --number <package>  the number [package] to use. Defaults to "big.js". 
                        "js" will use standard javascript numbers.
````

To convert a quantity try something like:

    isq 25 m/s --to km/h
     
# License
The [MIT license](LICENSE).

Copyright © 2015-2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=ISQ)
