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
    
    it('should allow dimensionless units', () => {
        units.rad.should.have.property('number', 1);
        units.rad.should.have.property('unit', {});

        new Quantity('1').should.have.property('number', 1);
        new Quantity('1').should.have.property('unit', {});

        new Quantity('m/m').should.have.property('number', 1);
        new Quantity('m/m').should.have.property('unit', {});
    });

    it('should allow unicode symbols', () => {
        let q = new Quantity('5 Ω');
        q.should.have.property('number', 5);
        q.should.have.property('unit',  { m: 2, kg: 1, s: -3, A: -2 });
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

    describe('as a string', () => {
        it('should be parseable', () => {
            let entropy0 = new Quantity('10 J/K');
            let entropy1 = new Quantity(entropy0.toString());
            entropy0.should.eql(entropy1);
        });
    });
        
    describe('Math', () => {
        it('should add 2 quantities', () => {
            let w = new Quantity('5 m').plus(new Quantity('10 m'));
            w.should.have.property('number', 15);
            w.should.have.property('unit', { m: 1});
        });

        it('should only add quantities', () => {
            units.kg.plus(units.kg).number.should.equal(2);
            (function() { units.kg.plus(1); }).should.throw("'1' is not a quantity");
        });

        it('should only add quantities with the same dimensions', () => {
            units.km.plus(new Quantity('3 cm')).number.should.eql(1000.03);
            (function() { units.km.plus(units.kg); }).should.throw("Not the same dimensions");
        });

        it('should subtract 2 quantities', () => {
            let w = new Quantity('5 m').minus(new Quantity('10 m'));
            w.should.have.property('number', -5);
            w.should.have.property('unit', { m: 1});
        });

        it('should only subtract quantities', () => {
            units.kg.plus(units.kg).number.should.eql(2);
            (function() { units.kg.minus(1); }).should.throw("'1' is not a quantity");
        });

        it('should only subtract quantities with the same dimensions', () => {
            units.km.minus(new Quantity('1 dam')).number.should.eql(990);
            (function() { units.km.minus(units.kg); }).should.throw("Not the same dimensions");
        });

        it('should multiply 2 quantities', () => {
            let volumne = new Quantity('5 kg').times(new Quantity('10 kg'));
            volumne.should.have.property('number', 50);
            volumne.should.have.property('unit', { kg: 2});
        });

        it('should multiply a quantity and a number', () => {
            let height = units.metre.times(10);
            height.should.have.property('number', 10);
            height.should.have.property('unit', { m: 1});
        });

        it('should divide 2 quantities', () => {
            let x = new Quantity('10 kg').dividedBy(new Quantity('5 kg'));
            x.should.have.property('number', 2);
            x.should.have.property('unit', {});
        });

        it('should divide a quantity by a number', () => {
            let height = units.metre.times(10).dividedBy(2);
            height.should.have.property('number', 5);
            height.should.have.property('unit', { m: 1});
        });

    });

    it('should equal another Quantity when the numbers and units are equal', () => {
        units.km.equals(new Quantity('1000 m')).should.be.true;
        units.km.equals(new Quantity('2000 m')).should.be.false;
        units.km.equals(1000).should.be.false;
    });

    it('should equal another Quantity that is not defined in base units', () => {
        require('../lib/def/derived').forEach(def => {
            if (def.other) {
                let q = new Quantity(def.other);
                units[def.name].equals(q).should.be.true;
            }
        });
    });

});
