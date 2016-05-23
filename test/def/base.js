'use strict';

let should = require('should'),
    units = require('../../lib/def/units');

describe('Base unit', () => {
    it('should have a single dimension', () => {
        let metre = units.m;
        metre.should.have.property('dimension');
        metre.dimension.should.have.property('name', 'length');
    });

});
