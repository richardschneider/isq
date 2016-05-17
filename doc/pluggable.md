 A pluggable architecture increases flexibility and extensibility. ISQ is extended to use other packages with the [`SI.config`](api/SI#config) object.
 
 ## Numbers
 
 By default, ISQ uses the javascript [Number](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number) to represent a numeric value which is [notorious](http://modernweb.com/2014/02/17/what-every-javascript-developer-should-know-about-floating-points/) for rounding and precision errors.  More precise packages ([big.js](https://www.npmjs.com/package/big.js), [big-decimal](https://www.npmjs.com/package/big-decimal), ...) can be used by setting `SI.config.Number` to the package's constructor
 
    SI.config.Number = require('big.js')
    
A number package is expected to implement the standard [math methods](math.md).  Various aliases are pre-defined to cope with naming inconsistencies. 
    
## Uncertain Numbers

By default, ISQ uses the supplied [UncertainNumber](api/UncertainNumber) to represent [uncertain](uncertainty.md) numeric values.  It can be changed with `SI.config.UncertainNumber`.  The extension package is expected to implement the standard [math methods](math.md) and also the `value` and `uncertainty` property.
