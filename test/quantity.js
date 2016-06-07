'use strict';

let should = require('should'),
    Quantity = require('../lib/quantity'),
    config = require('../lib/config'),
    units = Quantity.units;

describe('Quantity', () => {
    it('should have 7 dimensions', () => {
        Object.keys(Quantity.dimensions).should.have.length(7);
    });

    it('should have a number and a unit', () => {
        let length = new Quantity('5 m');
        length.should.have.property('number');
        length.number.toNumber().should.equal(5);
        length.should.have.property('unit', { m: 1});
    });

    it('should allow exponentiation of a unit', () => {
        let area = new Quantity('5 m^2');
        area.should.have.property('number');
        area.number.toNumber().should.equal(5);
        area.should.have.property('unit', { m: 2});
    });

    it('should default the number to 1', () => {
        new Quantity().should.have.property('number');
        new Quantity().number.toNumber().should.equal(1);
        new Quantity('kg').should.have.property('number');
        new Quantity('kg').number.toNumber().should.equal(1);
        new Quantity('kg').should.have.property('unit', { kg: 1});
    });

    it('should allow multiple units', () => {
        new Quantity('25 m/s').should.have.property('unit', { m: 1, s: -1});
    });

    it('should allow dimensionless units', () => {
        units.rad.should.have.property('number');
        units.rad.number.toNumber().should.eql(1);
        units.rad.should.have.property('unit', {});

        new Quantity('1').should.have.property('number');
        new Quantity('1').number.toNumber().should.eql(1);
        new Quantity('1').should.have.property('unit', {});

        new Quantity('m/m').should.have.property('number');
        new Quantity('m/m').number.toNumber().should.eql(1);
        new Quantity('m/m').should.have.property('unit', {});
    });

    it('should allow unicode symbols', () => {
        let q = new Quantity('5 Ω');
        q.should.have.property('number');
        q.number.toNumber().should.eql(5);
        q.should.have.property('unit',  { m: 2, kg: 1, s: -3, A: -2 });
    });

    it('should have an uncertain number as its number', () => {
        for (let prop in units) {
            let q = units[prop];
            if (q instanceof Quantity) {
                q.number.should.be.instanceOf(config.UncertainNumber);
            }
        }
    });

    describe('parsing', () => {
        it('should throw when a symbol is unknown', () => {
            new Quantity('100 kg').number.toNumber().should.have.eql(100);
            (function() { new Quantity('100 kkg'); }).should.throw("Unit 'kkg' is undefined in expression '100 kkg'");
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

    describe('formatting', () => {
        it('should be parseable', () => {
            let entropy0 = new Quantity('10 J/K');
            let entropy1 = new Quantity(entropy0.toString());
            entropy0.should.eql(entropy1);
        });

        it('should show the best symbol', () => {
            new Quantity('5 * 10^-6 s').toString().should.equal('5 µs');
            new Quantity('-5 * 10^-6 s').toString().should.equal('-5 µs');
            new Quantity('50 000 V/A').toString().should.equal('50 kΩ');
        });

        it('should use special symbols', () => {
            let pascalSecond = new Quantity('m⁻¹ kg s⁻¹');
            pascalSecond.toString().should.equal('1 Pa s');
            new Quantity('1 Pa s').toString().should.equal('1 Pa s');
        });

        it('should ignore some prefixes', () => {
            new Quantity('80 cm').toString().should.equal('80 cm');  // not '8 dm'
            new Quantity('800 cm').toString().should.equal('8 m');
        });
    });

    describe('math', () => {
        it('should add 2 quantities', () => {
            let w = new Quantity('5 m').plus(new Quantity('10 m'));
            w.number.toNumber().should.eql(15);
            w.should.have.property('unit', { m: 1});
        });

        it('should only add quantities', () => {
            units.kg.plus(units.kg).number.toNumber().should.equal(2);
            (function() { units.kg.plus(1); }).should.throw("'1' is not a quantity");
        });

        it('should only add quantities with the same dimensions', () => {
            units.km.plus(new Quantity('3 cm')).number.toNumber().should.eql(1000.03);
            (function() { units.km.plus(units.kg); }).should.throw("Not the same dimensions");
        });

        it('should subtract 2 quantities', () => {
            let w = new Quantity('5 m').minus(new Quantity('10 m'));
            w.number.toNumber().should.eql(-5);
            w.should.have.property('unit', { m: 1});
        });

        it('should only subtract quantities', () => {
            units.kg.plus(units.kg).number.toNumber().should.eql(2);
            (function() { units.kg.minus(1); }).should.throw("'1' is not a quantity");
        });

        it('should only subtract quantities with the same dimensions', () => {
            units.km.minus(new Quantity('1 dam')).number.toNumber().should.eql(990);
            (function() { units.km.minus(units.kg); }).should.throw("Not the same dimensions");
        });

        it('should multiply 2 quantities', () => {
            let volumne = new Quantity('5 kg').times(new Quantity('10 kg'));
            volumne.number.toNumber().should.eql(50);
            volumne.should.have.property('unit', { kg: 2});
        });

        it('should multiply a quantity and a number', () => {
            let height = units.metre.times(10);
            height.number.toNumber().should.eql(10);
            height.should.have.property('unit', { m: 1});
        });

        it('should divide 2 quantities', () => {
            let x = new Quantity('10 kg').dividedBy(new Quantity('5 kg'));
            x.number.toNumber().should.eql(2);
            x.should.have.property('unit', {});
        });

        it('should divide a quantity by a number', () => {
            let height = units.metre.times(10).dividedBy(2);
            height.number.toNumber().should.eql(5);
            height.should.have.property('unit', { m: 1});
        });

        it('should take the square root and power of a number', () => {
            let a = new Quantity('1.2 m'),
                b = new Quantity('80 cm'),
                c = a.pow(2).plus(b.pow(2)).sqrt();
            c.number.should.be.approximately(1.44, 0.005);
            c.should.have.property('unit', { m: 1});
        });

    });

    it('should equal another Quantity when the numbers and units are equal', () => {
        units.km.equals(units.km).should.be.true;
        units.km.equals(new Quantity('1000 m')).should.be.true;
        units.km.equals(new Quantity('2000 m')).should.be.false;
    });

    it('should equal another Quantity that is not defined in base units', () => {
        let check = function(def) {
            if (def.other) {
                let others = Array.isArray(def.other) ? def.other : [def.other];
                others.forEach(other => {
                    let q = new Quantity(other);
                    q.toString().should.equal(units[def.name].toString());
                });
            }
        };
        require('../lib/def/derived').forEach(check);
        require('../lib/def/other').forEach(check);
    });

    it('should convert to other units', () => {
        new Quantity('25 m/s').to('km/h').toNumber().should.equal(90);
        units.metre.times(25).dividedBy(units.second).to('km/h').toNumber().should.equal(90);
        units.metre.times(2000).to(units.km).toNumber().should.equal(2);
    });

    it('should not convert when dimensions are different', () => {
        (function() { new Quantity('25 m/s').to('kg'); }).should.throw("Not the same dimensions");
    });

    describe('measurement system', () => {
        it('should exist', () => {
            Quantity.systems.should.have.property('SI');
            Quantity.systems.should.have.property('non-SI');
        });

        it('should have a name', () => {
            for (let sname in Quantity.systems) {
                let system = Quantity.systems[sname];
                system.should.have.property('name', sname);
            }
        });


        it('should have defined units(symbols)', () => {
            for (let sname in Quantity.systems) {
                let system = Quantity.systems[sname];
                system.should.have.property('units');
                Object.keys(system.units).length.should.be.greaterThan(0);
            }
        });

    });

});
