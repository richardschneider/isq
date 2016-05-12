'use strict';

var should = require('should');
var UncertainNumber = require('../lib/UncertainNumber');

describe('Uncertain Number', () => {
    it('should have a value and an uncertainty', () => {
        let n = new UncertainNumber(1.2345, 0.0025);
        n.should.have.property('value').and.equal(1.2345);
        n.should.have.property('uncertainty').and.equal(0.0025);
    });

    it('should masquade as a Number', () => {
        let n = new UncertainNumber(1.23, 0.05) + 2;
        n.should.equal(3.23);
    });

    it('should be exact when uncertainty is undefined or zero', () => {
        new UncertainNumber(123.0).isExact().should.be.true;
        new UncertainNumber(123.0, 0.0).isExact().should.be.true;
        new UncertainNumber(123.0, 0.1).isExact().should.be.false;

        new UncertainNumber(123.0).isUncertain().should.be.false;
        new UncertainNumber(123.0, 0.0).isUncertain().should.be.false;
        new UncertainNumber(123.0, 0.1).isUncertain().should.be.true;
});

});

