'use strict';

let should = require('should'),
    units = require('../../lib/def/units');

describe('Units', () => {

    it('should not prefix kg', () => {
        units.should.have.property('kg');
        units.should.not.have.property('Mkg');
    });

    it('should prefix a gram', () => {
        units.should.have.property('g');
        units.should.have.property('Mg');
    });

});
