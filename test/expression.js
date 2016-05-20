'use strict';

let should = require('should'),
    Expression = require('../lib/Expression');

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

    it("should allow '×' and '⋅' for multiplication", () => {
        new Expression('a × b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a×b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a ⋅ b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a⋅b').toString().should.equal(new Expression('a*b').toString());
    });

    it('should allow unicode numeric superscripts as exponents', () => {
        new Expression('a^33 + b^2').should.eql(new Expression('a³³ + b²'));
        new Expression('a^-3 + b^-2').should.eql(new Expression('a⁻³ + b⁻²'));
    });

});
