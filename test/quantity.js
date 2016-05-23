'use strict';

let should = require('should'),
    Quantity = require('../lib/quantity'),
    units = Quantity.units;

describe('Quantity', () => {
    it('should have 7 dimensions', () => {
        Object.keys(Quantity.dimensions).should.have.length(7); 
    });
       
    describe('constructor', () => {
        it('should default the number to 1', () => {
            new Quantity().should.have.property('number', 1);
            new Quantity('kg').should.have.property('number', 1);
        });
    });
    
    describe('parsing', () => {
        it('should throw when symbol is unknown', () => {
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
