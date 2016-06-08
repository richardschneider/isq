'use strict';

let should = require('should'),
    isq = require('..');

describe('isq', () => {

    it('should create a Number from a string', () => {
        isq.Number('1.234 56').toNumber().should.equal(1.23456);
        isq.Number('1.234 56(78)').value.toNumber().should.equal(1.23456);
        isq.Number('1.234 56(78)').uncertainty.toNumber().should.equal(0.00078);
    });

    it('should create a Number from a literal number', () => {
        isq.Number(1.23456).toNumber().should.equal(1.23456);
    });

    it('should create a Number from a literal number and uncertainty', () => {
        isq.Number(1.23456, 0.00078).value.toNumber().should.equal(1.23456);
        isq.Number(1.23456, 0.00078).uncertainty.toNumber().should.equal(0.00078);
        isq.Number(1.23456, '0.00078').uncertainty.toNumber().should.equal(0.00078);
        isq.Number(1.23456, '7.8 × 10^-4').uncertainty.toNumber().should.equal(0.00078);
    });

    it('should return NaN for an invalid Number', () => {
        isq.Number('a').should.be.NaN;
        isq.Number('a', 1).should.be.NaN;
        isq.Number(1, 'a').should.be.NaN;
        isq.Number(1, 2, 3).should.be.NaN;
    });

    it('should allow test for uncertainty', () => {
        isq.isUncertain(123.0).should.be.false;
        isq.isUncertain(isq.Number(123.0, 0.0)).should.be.false;
        isq.isUncertain(isq.Number(123.0, 0.1)).should.be.true;
    });

    it('should create a Quantity from a string', () => {
        let Q = isq('1.234 56(1) m/s');
        Q.should.have.property('number');
        Q.should.have.property('unit');
    });

    it('should have predefined symbols', () => {
        isq.units.should.have.property('m');
        isq.units.should.have.property('Pa');
    });

    it('should have predefined names', () => {
        isq.units.should.have.property('metre');
        isq.units.should.have.property('pascal');
    });

});
