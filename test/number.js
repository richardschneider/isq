'use strict';

var should = require('should');
var SI = require('../lib/number');

describe('SI Number', () => {

    it('should be NaN when unparseable', () => {
        SI.parse('a').should.be.NaN;
    });

    it('can be an integer', () => {
        SI.parse('123').should.be.approximately(123, 0);
        SI.parse('-123').should.be.approximately(-123,  0);
        SI.parse('1234567891011121314151617181920').should.be.approximately(1234567891011121314151617181920, 0);
    });

    it('should allow grouping of digits with (thin) spaces', () => {
        SI.parse('-12 345.123 456').should.be.approximately(-12345.123456, 0);
        SI.parse('-12\u0020345.123\u0020456').should.be.approximately(-12345.123456, 0); // space
        SI.parse('-12\u00A0345.123\u00A0456').should.be.approximately(-12345.123456, 0); // no break space
        SI.parse('-12\u2009345.123\u2009456').should.be.approximately(-12345.123456, 0); // thin space
    });

    it('can be a percentage', () => {
        SI.parse('10 %').should.be.approximately(0.1, 0);
        SI.parse('0.25 %').should.be.approximately(0.0025, 0);
    });

    it('should preceed the decimal marker with a space', () => {
        SI.parse('0.2').should.not.be.a.NaN;
        SI.parse('.2').should.be.NaN;
    });

    it('should allow comma and dot as the decimal marker', () => {
        SI.parse('0.2').should.be.approximately(0.2, 0);
        SI.parse('0,2').should.be.approximately(0.2, 0);
    });

    it('should allow multiplication', () => {
        SI.parse('25 × 60.5').should.be.approximately(1512.5, 0);
        SI.parse('25 × 6.05 × 10¹').should.be.approximately(1512.5, 0);
        SI.parse('25 × a').should.be.NaN;
    });

    it('should allow an UNICODE exponent, e.g. 10⁻³', () => {
        SI.parse('10¹⁰').should.be.approximately(10000000000, 0);
        SI.parse('10⁴').should.be.approximately(10000, 0);
        SI.parse('10³').should.be.approximately(1000, 0);
        SI.parse('10²').should.be.approximately(100, 0);
        SI.parse('10¹').should.be.approximately(10, 0);
        SI.parse('10⁰').should.be.approximately(1, 0);
        SI.parse('10⁻³').should.be.approximately(0.001, 0);
        SI.parse('10⁻').should.be.NaN;
    });

    it('should allow an ASCII Math exponent, e.g. 10^-3', () => {
        SI.parse('10^10').should.be.approximately(10000000000, 0);
        SI.parse('10^4').should.be.approximately(10000, 0);
        SI.parse('10^3').should.be.approximately(1000, 0);
        SI.parse('10^2').should.be.approximately(100, 0);
        SI.parse('10^1').should.be.approximately(10, 0);
        SI.parse('10^0').should.be.approximately(1, 0);
        SI.parse('10^-3').should.be.approximately(0.001, 0);
        SI.parse('10^+3').should.be.approximately(1000, 0);
        SI.parse('10^').should.be.NaN;
        SI.parse('10^-').should.be.NaN;
        SI.parse('10^+').should.be.NaN;
    });

    it('should allow a Fortran exponent, e.g. 10^-3', () => {
        SI.parse('10**10').should.be.approximately(10000000000, 0);
        SI.parse('10**4').should.be.approximately(10000, 0);
        SI.parse('10**3').should.be.approximately(1000, 0);
        SI.parse('10**2').should.be.approximately(100, 0);
        SI.parse('10**1').should.be.approximately(10, 0);
        SI.parse('10**0').should.be.approximately(1, 0);
        SI.parse('10**-3').should.be.approximately(0.001, 0);
        SI.parse('10**+3').should.be.approximately(1000, 0);
        SI.parse('10**').should.be.NaN;
        SI.parse('10**-').should.be.NaN;
        SI.parse('10**+').should.be.NaN;
    });

    it('should allow exponential notation, e.g. 10e-3', () => {
        SI.parse('1E10').should.be.approximately(10000000000, 0);
        SI.parse('1e10').should.be.approximately(10000000000, 0);
        SI.parse('1e4').should.be.approximately(10000, 0);
        SI.parse('1e3').should.be.approximately(1000, 0);
        SI.parse('1e2').should.be.approximately(100, 0);
        SI.parse('1e1').should.be.approximately(10, 0);
        SI.parse('1e0').should.be.approximately(1, 0);
        SI.parse('1e-3').should.be.approximately(0.001, 0);
        SI.parse('1e+3').should.be.approximately(1000, 0);
        SI.parse('1e').should.be.NaN;
        SI.parse('1e-').should.be.NaN;
        SI.parse('1e+').should.be.NaN;
    });

    it('should allow uncertainty', () => {
        SI.parse('1.2345(23)').should.have.property('uncertainty');
        SI.parse('1.2345(23)').uncertainty.should.be.approximately(0.0023, 0);
        SI.parse('1.674 927 28(29)').uncertainty.should.be.approximately(0.00000029, 0);
        SI.parse('1.674 927 28(29) × 10⁻²⁷').uncertainty.should.be.approximately(0.00000029e-27, 0.000000001e-27);
    });

});

