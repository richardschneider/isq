# Getting Started

### Prerequisites

You'll need to have the following software installed:

* [nodeJS](https://nodejs.org/en/download/)
* [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

### Installation

    > npm install isq
    
The [big.js](https://www.npmjs.com/package/big.js) package is recommended for arbitrary-precision decimal arithmetic.

    > npm install big.js 
    
### Usage

````
> node
SI = require('isq')
SI.config.Number = require('big.js')

let a = SI.Number('1.2(2)'),   // 1.2±0.2
    b = SI.Number('1.3(3)'),   // 1.3±0.3
    length = a.plus(b);        // 2.5±0.4
````