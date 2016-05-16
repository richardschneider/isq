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

    it('should add and propagate uncertainty', () => {
        let x1 = new UncertainNumber(9.3, 0.2),
            x2 = new UncertainNumber(14.4, 0.3),
            length = x1.plus(x2);
        length.should.have.property('value').and.be.approximately(23.7, 0.01);
        length.should.have.property('uncertainty').and.be.approximately(0.36, 0.001);

        length = x1.plus(14.4);
        length.should.have.property('value').and.be.approximately(23.7, 0.01);
        length.should.have.property('uncertainty').and.be.equal(0.2);
    });

    it('should subtract and propagate uncertainty', () => {
        let x1 = new UncertainNumber(9.3, 0.2),
            x2 = new UncertainNumber(14.4, 0.3),
            delta = x2.minus(x1);
        delta.should.have.property('value', 5.1);
        delta.should.have.property('uncertainty').and.be.approximately(0.36, 0.001);

        let H = new UncertainNumber(2.0, 0.03),
            h = new UncertainNumber(0.88, 0.04),
            Q = H.minus(h);
        Q.should.have.property('value').and.be.approximately(1.12, 0.001);
        Q.should.have.property('uncertainty').and.be.approximately(0.05, 0.001);
    });

    it('should multiply and propagate uncertainty', () => {
        let w = new UncertainNumber(4.52, 0.02),
            x = new UncertainNumber(2.0, 0.2),
            z = w.times(x);
        z.should.have.property('value').and.be.approximately(9.04, 0.001);
        z.should.have.property('uncertainty').and.be.approximately(0.9, 0.01);
    });

    it('should divide and propagate uncertainty', () => {
        let x = new UncertainNumber(5.1, 0.4),
            t = new UncertainNumber(0.4, 0.1),
            v = x.dividedBy(t);
        v.should.have.property('value').and.be.approximately(12.75, 0.001);
        v.should.have.property('uncertainty').and.be.approximately(3.34, 0.001);

        let d = new UncertainNumber(120, 3),
            t1 = new UncertainNumber(20, 1.2),
            v1 = d.dividedBy(t1);
        v1.should.have.property('value').and.be.approximately(6, 0.1);
        v1.should.have.property('uncertainty').and.be.approximately(0.39, 0.001);

        let u = new UncertainNumber(120, 3),
            c = 10,
            r = u.dividedBy(c);
        r.should.have.property('value', 12);
        r.should.have.property('uncertainty', 30);
    });

    it('should raise to power and propagate uncertainty', () => {
        let T  = new UncertainNumber(0.20, 0.01),
            f = T.pow(-1);
        f.should.have.property('value').and.be.approximately(5, 0.1);
        f.should.have.property('uncertainty').and.be.approximately(0.25, 0.001);
    });

});
