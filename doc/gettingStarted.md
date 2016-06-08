### Prerequisites

You'll need to have the following software installed:

* [nodeJS](https://nodejs.org/en/download/)
* [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

### Installation

The latest version is always available on NPM

    > npm install isq
    
The [big.js](https://www.npmjs.com/package/big.js) package is recommended for arbitrary-precision decimal arithmetic.

    > npm install big.js 
    
### Usage

Get the packages

    > node
    isq = require('isq')
    isq.config.Number = require('big.js')


Determine the length of a line when the starting and ending points are uncertain.

    let a = isq('1.2(2) cm'),       // 1.2±0.2 cm
        b = isq('1.3(3) cm'),       // 1.3±0.3 cm
        length = a.plus(b);         // 2.5±0.4 cm

Convert to another unit

    let speed = isq('25 m/s'),      // 25 m s⁻¹
        kph = speed.to('km/h');     // 90
