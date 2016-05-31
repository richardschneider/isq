Uncertainity, or margin of error, describes the imperfect nature of a measurement.  Typically, it is the standard deviation of actual measurements.

### Defining

According to [NIST](http://physics.nist.gov/cgi-bin/cuu/Value?mn), the mass of a neutron is `1.674 927 471 x 10⁻²⁷ kg` with a standard uncertainity of `0.000 000 021 x 10⁻²⁷ kg`.  

An [uncertain number](api/UncertainNumber) has a [value](api/UncertainNumber#value) and an [uncertainty](api/UncertainNumber#uncertainty). It is created in the following ways:

    let mn = SI.Number('1.674 927 471(21) × 10⁻²⁷')
    let mn = SI.Number('1.674 927 471(21) * 10^-27')
    let mn = SI.Number(1.674927471e-27, 0.000000021e-27)

### Propagation

Anytime a [calculation](math) is performed, *propagation of uncertainity* is also performed to determine the [uncertainty](api/UncertainNumber#uncertainty) of the result.

    let a = SI.Number('1.2(2)'),   // 1.2±0.2
        b = SI.Number('1.3(3)'),   // 1.3±0.3
        length = a.plus(b);        // 2.5±0.4


### Comparision

Equality requires taking the uncertainity of both values into consideration.

ISQ defines equality as *Is the difference of the two values within the resulting uncertainty?* 

    function equals(a, b) {
        let D = a.minus(b);
        return D.value.abs().lte(D.uncertainty);
    };


