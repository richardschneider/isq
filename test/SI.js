'use strict';

let should = require('should'),
    SI = require('..');

describe('SI', () => {

    it('should create a Number from a string', () => {
        SI.Number('1.234 56').valueOf().should.equal(1.23456);
        SI.Number('1.234 56(78)').valueOf().should.equal(1.23456);
        SI.Number('1.234 56(78)').uncertainty.valueOf().should.equal(0.00078);
    });

    it('should create a Number from a literal number', () => {
        SI.Number(1.23456).valueOf().should.equal(1.23456);
    });

    it('should create a Number from a literal number and uncertainty', () => {
        SI.Number(1.23456, 0.00078).valueOf().should.equal(1.23456);
        SI.Number(1.23456, 0.00078).uncertainty.valueOf().should.equal(0.00078);
        SI.Number(1.23456, '0.00078').uncertainty.valueOf().should.equal(0.00078);
        SI.Number(1.23456, '7.8 × 10^-4').uncertainty.valueOf().should.equal(0.00078);
    });

    it('should return NaN for an invalid Number', () => {
        SI.Number('a').should.be.NaN;
        SI.Number('a', 1).should.be.NaN;
        SI.Number(1, 'a').should.be.NaN;
        SI.Number(1, 2, 3).should.be.NaN;
    });

    it('should allow test for uncertainty', () => {
        SI.isUncertain(123.0).should.be.false;
        SI.isUncertain(123.0, 0.0).should.be.false;
        SI.isUncertain(123.0, 0.1).should.be.true;
    });


});
