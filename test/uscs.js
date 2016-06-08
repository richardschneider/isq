'use strict';

let should = require('should'),
    isq = require('..'),
    Big = require('big.js');

describe('United States Customary System', () => {

    before(() => {
        isq.use('uscs');
    });

    after(() => {
        isq.unuse('uscs');
    });

    it('should convert to SI', () => {
        isq('1 mi').in('SI').should.equal('1.609 344 km');
    });

    it('should show closest symbol', () => {
        isq('2 ft').in('uscs').should.equal('2 ft');
        isq('3 ft').in('uscs').should.equal('1 yd');
        isq('3 * 1.609 344 km').in('uscs').should.equal('3 mi');
    });

});
