'use strict';

let should = require('should'),
    Quantity = require('../lib/quantity'),
    units = Quantity.units;

describe('Quantity', () => {
    it('should have 7 dimensions', () => {
        Object.keys(Quantity.dimensions).should.have.length(7); 
    });

    it('should have a number and a unit', () => {
        let length = new Quantity('5 m');
        length.should.have.property('number', 5);
        length.should.have.property('unit', { m: 1});
    });

    it('should allow exponentiation of a unit', () => {
        let area = new Quantity('5 m^2');
        area.should.have.property('number', 5);
        area.should.have.property('unit', { m: 2});
    });

    it('should default the number to 1', () => {
        new Quantity().should.have.property('number', 1);
        new Quantity('kg').should.have.property('number', 1);
        new Quantity('kg').should.have.property('unit', { kg: 1});
    });

    it('should allow multiple units', () => {
        new Quantity('25 m/s').should.have.property('unit', { m: 1, s: -1});
    });
    
    describe('parsing', () => {
        it('should throw when a symbol is unknown', () => {
            new Quantity('100 kg').should.have.property('number', 100);
            (function() { new Quantity('100 kkg'); }).should.throw("Unit 'kkg' is undefined in expression 'kkg'");
        });
    });

    describe('base unit', () => {
        it('should have a single dimension', () => {
            units.should.have.property('m');
            let metre = Quantity.units.m;
            metre.should.have.property('dimension');
            metre.dimension.should.have.property('name', 'length');
        });
        
        it('should not prefix kg', () => {
            units.should.have.property('kg');
            units.should.not.have.property('Mkg');
        });

        it('should prefix a gram', () => {
            units.should.have.property('g');
            units.should.have.property('Mg');
        });

    });
        
});
