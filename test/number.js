'use strict';

var should = require('should');
var SI = require('../lib/number');

describe('SI Number', () => {

    it('can be an integer', () => {
        SI.parse('123')
            .should.be.exactly(123)
            .and.a.Number;
        SI.parse('-123')
            .should.be.exactly(-123)
            .and.a.Number;
        SI.parse('1234567891011121314151617181920')
            .should.be.exactly(1234567891011121314151617181920)
            .and.a.Number;
    });

    it('should allow grouping of digits with (thin) spaces', () => {
        SI.parse('-12 345.123 456').should.be.exactly(-12345.123456);
        SI.parse('-12\u0020345.123\u0020456').should.be.exactly(-12345.123456); // space
        SI.parse('-12\u00A0345.123\u00A0456').should.be.exactly(-12345.123456); // no break space
        SI.parse('-12\u2009345.123\u2009456').should.be.exactly(-12345.123456); // thin space
    });

    it('can be a percentage', () => {
        SI.parse('10 %')
            .should.be.exactly(0.1)
            .and.a.Number;
        SI.parse('0.25 %')
            .should.be.exactly(0.0025)
            .and.a.Number;
    });

    it('should preceed the decimal marker with a space', () => {
        SI.parse('0.2').should.be.a.Number;
        SI.parse('.2').should.be.NaN;
    });

    it('should allow comma and dot as the decimal marker', () => {
        SI.parse('0.2').should.be.exactly(0.2);
        SI.parse('0,2').should.be.exactly(0.2);
    });

    it('should allow multiplication', () => {
        SI.parse('25 × 60.5').should.be.exactly(1512.5);
        SI.parse('25 × a').should.be.NaN;
    });

    it('should allow an UNICODE exponent, e.g. 10⁻³', () => {
        SI.parse('10¹⁰').should.be.exactly(10000000000);
        SI.parse('10⁴').should.be.exactly(10000);
        SI.parse('10³').should.be.exactly(1000);
        SI.parse('10²').should.be.exactly(100);
        SI.parse('10¹').should.be.exactly(10);
        SI.parse('10⁰').should.be.exactly(1);
        SI.parse('10⁻³').should.be.exactly(0.001);
        SI.parse('10⁻').should.be.NaN;
    });

    it('should allow an ASCII Math exponent, e.g. 10^-3', () => {
        SI.parse('10^10').should.be.exactly(10000000000);
        SI.parse('10^4').should.be.exactly(10000);
        SI.parse('10^3').should.be.exactly(1000);
        SI.parse('10^2').should.be.exactly(100);
        SI.parse('10^1').should.be.exactly(10);
        SI.parse('10^0').should.be.exactly(1);
        SI.parse('10^-3').should.be.exactly(0.001);
        SI.parse('10^+3').should.be.exactly(1000);
        SI.parse('10^').should.be.NaN;
        SI.parse('10^-').should.be.NaN;
        SI.parse('10^+').should.be.NaN;
    });

    it('should allow a Fortran exponent, e.g. 10^-3', () => {
        SI.parse('10**10').should.be.exactly(10000000000);
        SI.parse('10**4').should.be.exactly(10000);
        SI.parse('10**3').should.be.exactly(1000);
        SI.parse('10**2').should.be.exactly(100);
        SI.parse('10**1').should.be.exactly(10);
        SI.parse('10**0').should.be.exactly(1);
        SI.parse('10**-3').should.be.exactly(0.001);
        SI.parse('10**+3').should.be.exactly(1000);
        SI.parse('10**').should.be.NaN;
        SI.parse('10**-').should.be.NaN;
        SI.parse('10**+').should.be.NaN;
    });

    it('should allow exponential notation, e.g. 10e-3', () => {
        SI.parse('1E10').should.be.exactly(10000000000);
        SI.parse('1e10').should.be.exactly(10000000000);
        SI.parse('1e4').should.be.exactly(10000);
        SI.parse('1e3').should.be.exactly(1000);
        SI.parse('1e2').should.be.exactly(100);
        SI.parse('1e1').should.be.exactly(10);
        SI.parse('1e0').should.be.exactly(1);
        SI.parse('1e-3').should.be.exactly(0.001);
        SI.parse('1e+3').should.be.exactly(1000);
        SI.parse('1e').should.be.NaN;
        SI.parse('1e-').should.be.NaN;
        SI.parse('1e+').should.be.NaN;
    });

    it('should allow uncertainty', () => {
        // console.log('x', SI.parse('1.674 927 28(29) × 10⁻²⁷'));
        SI.parse('1.2345(23)').should.have.property('uncertainty', 0.0023);
        SI.parse('1.674 927 28(29)').should.have.property('uncertainty', 0.00000029);
        // TODO: SI.parse('1.674 927 28(29) × 10⁻²⁷').should.have.property('uncertainty', 0.00000029e-27);
    });

});

