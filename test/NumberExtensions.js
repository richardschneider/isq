'use strict';

let should = require('should'),
    UncertainNumber = require('../lib/UncertainNumber');

describe('Number', () => {
    it('should be exact and not be uncertain', () => {
        let f = 123.0;
        f.isExact().should.be.true;
        f.isUncertain().should.be.false;
        let i = 123;
        i.isExact().should.be.true;
        i.isUncertain().should.be.false;
    });

});

