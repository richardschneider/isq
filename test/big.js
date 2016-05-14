'use strict';

let should = require('should'),
    SI = require('../lib/number'),
    config = require('../lib/config'),
    Big = require('big.js');

describe('SI Number using big.js', () => {

    let originalNumber = config.Number;

    beforeEach(() => {
        config.Number = Big;
        Big.DP = 40;
    });

    afterEach(() => {
        config.Number = originalNumber;
    });

    it('should parse to a Big', () => {
        SI.parse('1.3').should.be.instanceof(Big);
        SI.parse('1.3(1)').value.should.be.instanceof(Big);
        SI.parse('1.3(1)').uncertainty.should.be.instanceof(Big);
        SI.parse('10^2').should.be.instanceof(Big);
        SI.parse('10**2').should.be.instanceof(Big);
        SI.parse('10e2').should.be.instanceof(Big);
    });

    it('should allow uncertainty', () => {
        SI.parse('1.2345(23)').should.have.property('uncertainty');
        SI.parse('1.2345(23)').uncertainty.eq(0.0023).should.be.true;
        SI.parse('1.674 927 28(29)').uncertainty.eq(0.00000029).should.be.true;

        SI.parse('1.674 927 28(29) × 10**-27').uncertainty.eq(0.00000029e-27).should.be.true;
        SI.parse('1.674 927 28(29) × 10^-27').uncertainty.eq(0.00000029e-27).should.be.true;
        SI.parse('1.674 927 28(29) × 10⁻²⁷').uncertainty.eq(0.00000029e-27).should.be.true;
    });

});
