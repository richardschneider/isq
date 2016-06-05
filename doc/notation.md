
### Number

A basic SI number is a float, such as `12345.67891`. The decimal marker can also be a [comma](), such as `12345,67891`.  For readable, a [thin space]() is also allowed, such as `12 345.678 91`. [Exponentiation](https://en.wikipedia.org/wiki/Exponentiation) is specified with the [superscipt numbers](); `3²` is equivalent to `9`.


A [precentage](https://en.wikipedia.org/wiki/Percentage) is specified with the [percent sign]().  `0.25 %` is equivalent to `0.0025`.

An [uncertain value](uncertainty) is specified with the [left parenthesis]() and [right parenthesis]() symbols, such as `12 345.678 91(5)` and is equivalent to `12345.67891±0.00005`.

[Multiplication](https://en.wikipedia.org/wiki/Multiplication) is specified with the [multiplication sign](http://graphemica.com/%C3%97), such as `1.234 567 891(5) × 10⁴` and is equivalent to `12 345.678 91 ± 0.000 05`.

#### ASCII Number

The SI representation of a number requires [Unicode code points](http://www.joelonsoftware.com/articles/Unicode.html) outside of the [ASCII characters](https://en.wikipedia.org/wiki/ASCII).  To make life easier for programmers the following relaxations are allowed:

* Any white space character can be used for a [thin space]()
* `*` can be used for a [multiplication sign]()
* `^` or `**` can be use for [exponentiation](https://en.wikipedia.org/wiki/Exponentiation)

For example, `1.234 567 891(5) * 10**4` is equivalent to `12345.67891±0.00005`

### Quantity

A SI Quantity consists of a *number* and a *unit*.  If not specified, the *number* defaults to `1`.  The *unit* is a defined [ISO-80000](https://en.wikipedia.org/wiki/ISO/IEC_80000) symbol or a symbolic expression.  

Any of the following expressions can be used to define *watt per square metre steradian*:

* `W/(m² sr)`
* `m² m⁻² kg s⁻³`
* `kg s⁻³`
