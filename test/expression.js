'use strict';

let should = require('should'),
    Expression = require('../lib/expression');

describe('Expression', () => {
    it('should be representated as an AST (Abstract Syntax Tree)', () => {
        new Expression('a + b + c').should.have.property('ast');
    });

    it('should convert to a string', () => {
        let a = new Expression('a + b + 1 + -c'),
            b = a.toString();

        b.should.be.instanceof(String);
        a.should.eql(new Expression(b));
    });

    it('should convert to a string without redundant parentheses', () => {
        new Expression('(a + b) + (c^2)').toString().should.equal('a+b+c^2');
        new Expression('(a + b) / (c^2)').toString().should.equal('(a+b)/c^2');
        new Expression('(a + b) / (c^(z+n))').toString().should.equal('(a+b)/c^(z+n)');
        new Expression('(a + (b / (c^2)))').toString().should.equal('a+b/c^2');
        new Expression('(a + (b / (c^(z+n))))').toString().should.equal('a+b/c^(z+n)');
    });

    it("should allow '×' and '⋅' for multiplication", () => {
        new Expression('a × b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a×b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a ⋅ b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a⋅b').toString().should.equal(new Expression('a*b').toString());
    });

    it('should allow space for multiplication', () => {
        new Expression('m kg s⁻²').should.eql(new Expression('m × kg × s^-2'));
    });

    it('should allow unicode numeric superscripts as exponents', () => {
        new Expression('a^33 + b^2').should.eql(new Expression('a³³ + b²'));
        new Expression('a^-3 + b^-2').should.eql(new Expression('a⁻³ + b⁻²'));
    });

    it('should resolve an identifier to a value', () => {
        let x = new Expression('-a + b + c'),
            defs = {
                a: 1,
                b: 2,
                c: 3
            };

        x.resolve(symbol => defs[symbol]).toString().should.equal('-1+2+3');
    });

    it('should resolve an identifier to an expression', () => {
        let x = new Expression('-a + b + c'),
            defs = {
                a: 1,
                b: 2,
                c: new Expression('x^b')
            };

        x.resolve(symbol => defs[symbol]).toString().should.equal('-1+2+x^2');
    });

    it('should be immutable', () => {
        let x = new Expression('a + b'),
            defs = {
                a: new Expression('1'),
                b: new Expression('a + a')
            };

        x.resolve(symbol => defs[symbol]).toString().should.equal('1+1+1');
        defs.a.toString().should.equal('1');
        defs.b.toString().should.equal('a+a');
    });

});
