Javascript does not allow overiding of operators, so named methods are used.  The methods are also chainable.  For example, the hypotenuse of a triangle is calculated as:

    var c = a.pow(2).plus(b.pow(2)).sqrt()

## Methods

The table below contains:

* *Name* - the ISQ method name
* *JS Equivalent* - the equivalent javascript symbol or function
* *Aliases* - method name(s) used by other Number packages

Name  | JS Equivalent | Aliases
------ | ---- | -------
plus | + |  add
minus | - | subtract
times | * | mul, multiply or multiplyBy
dividedBy | / | div, divide or divideBy
abs | Math.abs | 
pow | Math.pow |
sqrt | Math.pow(*x*, 0.5) |
eq | == | equal, equals, eql or equalTo
ne | != | notEqual, notEquals or notEqualTo
lt | < | lessThan
gt | > | greaterThan
lte | <= | lessThanOrEqual
gte | >= | greaterThanOrEqual
cmp | *see below* | compare or comparesTo

## Comparision

`cmp` compares two numbers and returns a value (-1, 0 or 1) that indicates whether the first number is less than, equal to, or greater than the second number.  

A sample implementation is:

````js
function cmp(a, b) {
    let D = a - b;
    return D === 0 ? 0 : D <= 0 ? -1 : 1;
}
````
