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


});

