'use strict';

let should = require('should'),
    isq = require('..'),
    Big = require('big.js');

describe('isq Number using big.js', () => {

    let originalNumber = isq.config.Number;

    beforeEach(() => {
        isq.config.Number = Big;
        Big.DP = 40;
    });

    afterEach(() => {
        isq.config.Number = originalNumber;
    });

    it('should parse to a Big', () => {
        isq.Number('1.3').should.be.instanceof(Big);
        isq.Number('1.3(1)').value.should.be.instanceof(Big);
        isq.Number('1.3(1)').uncertainty.should.be.instanceof(Big);
        isq.Number('10^2').should.be.instanceof(Big);
        isq.Number('10**2').should.be.instanceof(Big);
        isq.Number('10e2').should.be.instanceof(Big);
    });

    it('should allow uncertainty', () => {
        isq.Number('1.2345(23)').should.have.property('uncertainty');
        isq.Number('1.2345(23)').uncertainty.eq(0.0023).should.be.true;
        isq.Number('1.674 927 28(29)').uncertainty.eq(0.00000029).should.be.true;

        isq.Number('1.674 927 28(29) × 10**-27').uncertainty.eq(0.00000029e-27).should.be.true;
        isq.Number('1.674 927 28(29) × 10^-27').uncertainty.eq(0.00000029e-27).should.be.true;
        isq.Number('1.674 927 28(29) × 10⁻²⁷').uncertainty.eq(0.00000029e-27).should.be.true;
    });

    it('should propagate uncertainty', () => {
        let a = isq.Number('1.2(2)'),
            b = isq.Number('1.3(3)'),
            length = a.plus(b),
            area = a.times(b);

        length.should.be.instanceof(isq.config.UncertainNumber);
        length.value.should.be.instanceof(Big);
        length.uncertainty.should.be.instanceof(Big);
        length.value.toFixed(1).should.be.equal('2.5');
        length.uncertainty.toFixed(1).should.be.equal('0.4');

        area.should.be.instanceof(isq.config.UncertainNumber);
        area.value.should.be.instanceof(Big);
        area.uncertainty.should.be.instanceof(Big);
        area.value.toFixed(2).should.be.equal('1.56');
        area.uncertainty.toFixed(1).should.be.equal('0.4');
    });

    it('should compare with uncertainty', () => {
        let a = isq.Number(1, 0.1);
        a.cmp(a).should.equal(0);
        a.cmp(0.8).should.equal(1);
        a.cmp(0.9).should.equal(0);
        a.cmp(1.0).should.equal(0);
        a.cmp(1.1).should.equal(0);
        a.cmp(1.2).should.equal(-1);

        a.cmp(isq.Number(0.8)).should.equal(1);
        a.cmp(isq.Number(0.9)).should.equal(0);
        a.cmp(isq.Number(1.0)).should.equal(0);
        a.cmp(isq.Number(1.1)).should.equal(0);
        a.cmp(isq.Number(1.2)).should.equal(-1);
    });

    it('should be human readable', () => {
        isq.Number('1.2345(23)').toString().should.equal('1.2345 ± 0.0023');
    });

    it('should take the square root and power of a number', () => {
        let a = isq('1.2 m'),
            b = isq('80 cm'),
            c = a.pow(2).plus(b.pow(2)).sqrt();
        c.number.should.be.approximately(1.44, 0.005);
        c.should.have.property('unit', { m: 1});
    });

});
