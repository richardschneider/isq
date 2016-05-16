'use strict';

let should = require('should'),
    SI = require('..'),
    Big = require('big.js');

describe('SI Number using big.js', () => {

    let originalNumber = SI.config.Number;

    beforeEach(() => {
        SI.config.Number = Big;
        Big.DP = 40;
    });

    afterEach(() => {
        SI.config.Number = originalNumber;
    });

    it('should parse to a Big', () => {
        SI.Number('1.3').should.be.instanceof(Big);
        SI.Number('1.3(1)').value.should.be.instanceof(Big);
        SI.Number('1.3(1)').uncertainty.should.be.instanceof(Big);
        SI.Number('10^2').should.be.instanceof(Big);
        SI.Number('10**2').should.be.instanceof(Big);
        SI.Number('10e2').should.be.instanceof(Big);
    });

    it('should allow uncertainty', () => {
        SI.Number('1.2345(23)').should.have.property('uncertainty');
        SI.Number('1.2345(23)').uncertainty.eq(0.0023).should.be.true;
        SI.Number('1.674 927 28(29)').uncertainty.eq(0.00000029).should.be.true;

        SI.Number('1.674 927 28(29) × 10**-27').uncertainty.eq(0.00000029e-27).should.be.true;
        SI.Number('1.674 927 28(29) × 10^-27').uncertainty.eq(0.00000029e-27).should.be.true;
        SI.Number('1.674 927 28(29) × 10⁻²⁷').uncertainty.eq(0.00000029e-27).should.be.true;
    });

    it('should propagate uncertainty', () => {
        let a = SI.Number('1.2(2)'),
            b = SI.Number('1.3(3)'),
            length = a.plus(b),
            area = a.times(b);

        length.should.be.instanceof(SI.config.UncertainNumber);
        length.value.should.be.instanceof(Big);
        length.uncertainty.should.be.instanceof(Big);
        length.value.toFixed(1).should.be.equal('2.5');
        length.uncertainty.toFixed(1).should.be.equal('0.4');

        area.should.be.instanceof(SI.config.UncertainNumber);
        area.value.should.be.instanceof(Big);
        area.uncertainty.should.be.instanceof(Big);
        area.value.toFixed(2).should.be.equal('1.56');
        area.uncertainty.toFixed(1).should.be.equal('0.4');
    });

    it('should be human readable', () => {
        SI.Number('1.2345(23)').toString().should.equal('1.2345 ± 0.0023');
    });
});
