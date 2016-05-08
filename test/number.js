'use strict';

var should = require('should');
var SI = require('../lib/number');

describe('SI Number', () => {

    it('can be an integer', () => {
        SI.parse('123')
            .should.be.exactly(123)
            .and.a.Number;
        SI.parse('-123')
            .should.be.exactly(-123)
            .and.a.Number;
        SI.parse('1234567891011121314151617181920')
            .should.be.exactly(1234567891011121314151617181920)
            .and.a.Number;
    });

    it('should allow grouping of digits with (thin) spaces', () => {
        SI.parse('-12 345.123 456').should.be.exactly(-12345.123456);
        SI.parse('-12\u0020345.123\u0020456').should.be.exactly(-12345.123456); // space
        SI.parse('-12\u00A0345.123\u00A0456').should.be.exactly(-12345.123456); // no break space
        SI.parse('-12\u2009345.123\u2009456').should.be.exactly(-12345.123456); // thin space
    });

    it('can be a percentage', () => {
        SI.parse('10 %')
            .should.be.exactly(0.1)
            .and.a.Number;
        SI.parse('0.25 %')
            .should.be.exactly(0.0025)
            .and.a.Number;
    });

    it('should preceed the decimal marker with a space', () => {
        SI.parse('0.2').should.be.a.Number;
        SI.parse('.2').should.be.NaN;
    });

    it('should allow comma and dot as the decimal marker', () => {
        SI.parse('0.2').should.be.exactly(0.2);
        SI.parse('0,2').should.be.exactly(0.2);
    });

});

