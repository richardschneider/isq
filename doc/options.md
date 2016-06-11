Options for formatting and parsing are available `isq.config.options`.  You can modify these properties directly, but making global changes is consider bad form.  It's better to simply override when parsing/formatting, such as 

    isq('.5 km', { leadingDigit: false})
    
### Parsing options

Option | Default | Description
------ | ------- | -----------
implicitMultiplication | `true` | Allow number followed by a unit to be a multiplication operation, `5 km` is equivalent to `5 * km`.
leadingDigit | `true` | Require a number to start with a digit

### Formatting options

Option | Default | Description
------ | ------- | -----------
decimalMark | `'.'` | The string to use representation fractional part of a number.  Some locales like a comma for numbers, such a '1,23'.
exponentMark | `'^'` | The string that represents an exponent.  Only used for numbers when `unicodeSuperscript` is `false`.
powersOf10 | `true` | Exact powers of 10 are shown as an exponent, such as `10³` or `10^3` for `1000`.
unicodeSuperscript | `true` | Use uncode superscript code points to represent a numeric exponent.
bestSymbol | `true` | Finds the best symbol to represent the value.  If `false`, it is represented in SI base units, `1 km` vs. `10³ m`.
system | `'SI'` | The measurement system that contains the `bestSymbol`.
ignoreSymbols | `['deca', 'hecto', 'deci']` | Symbols starting with these names will not be used; `80 cm` will not be shown as `8 dm`.
minDigitsForSeparation | 5 | The minimum number of digits before group separation occurs; `1234` vs `12 345`.
uncertaintyPrecision | 2 | The maximun number of significant digits for the uncertainty of a number. 
