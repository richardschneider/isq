'use strict';

let should = require('should'),
    SI = require('../lib/number');

describe('Number', () => {
    it('should be exact and not be uncertain', () => {
        let f = 123.0;
        f.isExact().should.be.true;
        f.isUncertain().should.be.false;
        let i = 123;
        i.isExact().should.be.true;
        i.isUncertain().should.be.false;
    });

    it('should allow named operators', () => {
        let a = 2, b = 3;
        a.plus(b).should.equal(5);
        a.minus(b).should.equal(-1);
        a.times(b).should.equal(6);
        a.dividedBy(a).should.equal(1);
    });

});

