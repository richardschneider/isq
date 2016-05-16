'use strict';

let should = require('should'),
    SI = require('..');

describe('Number', () => {
    it('should be exact and not be uncertain', () => {
        SI.isUncertain(123).should.be.false;
        SI.isUncertain(123.45).should.be.false;
    });

    it('should allow named mathmatical operators', () => {
        SI.config.Number.should.equal(Number);

        let a = 2, b = 3, c = -2;
        a.plus(b).should.equal(5);
        a.minus(b).should.equal(-1);
        a.times(b).should.equal(6);
        a.dividedBy(a).should.equal(1);
        a.abs().should.equal(2);
        c.abs().should.equal(2);
        b.pow(2).should.equal(9);
        (9).pow(0.5).should.equal(3);
        (9).sqrt().should.equal(3);
    });

    it('should allow named comparision operators', () => {
        SI.config.Number.should.equal(Number);

        let a = 2, b = 3;
        a.eq(b).should.be.false;
        a.ne(b).should.be.true;
        a.lt(b).should.be.true;
        a.gt(b).should.be.false;
        a.lte(b).should.be.true;
        a.gte(b).should.be.false;
        a.lte(a).should.true;
        a.gte(a).should.true;
        b.lte(b).should.true;
        b.gte(b).should.true;
    });

});
