'use strict';

let should = require('should'),
    Expression = require('../lib/expression');

describe('Expression', () => {
    it('should be representated as an AST (Abstract Syntax Tree)', () => {
        new Expression('a + b + c').should.have.property('ast');
    });

    describe('conversion to a string', () => {

        it('should return a parseable string', () => {
            let a = new Expression('a + b + 1 + -c'),
                b = a.toString();

            b.should.be.instanceof(String);
            a.should.eql(new Expression(b));
        });

        it('should remove redundant parentheses', () => {
            new Expression('(a + b) + (c^2)').toString().should.equal('a+b+c²');
            new Expression('(a + b) / (c^2)').toString().should.equal('(a+b)/c²');
            new Expression('(a + b) / (c^(z+n))').toString().should.equal('(a+b)/c^(z+n)');
            new Expression('(a + (b / (c^2)))').toString().should.equal('a+b/c²');
            new Expression('(a + (b / (c^(z+n))))').toString().should.equal('a+b/c^(z+n)');
        });

        it('should allow different symbols for multiplication', () => {
           new Expression('a * b').toString({ multiplicationMark: ' '}).should.equal('a b');
        });

        it('should allow different symbols for an exponent', () => {
           new Expression('a ^ b').toString({ exponentMark: '**'}).should.equal('a**b');
        });

        it('should allow unicode superscripts', () => {
           new Expression('a^2').toString({ unicodeSuperscript: true }).should.equal('a²');
           new Expression('a^-2').toString({ unicodeSuperscript: true }).should.equal('a⁻²');
        });

    });

    it("should allow '×' and '⋅' for multiplication", () => {
        new Expression('a × b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a×b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a ⋅ b').toString().should.equal(new Expression('a*b').toString());
        new Expression('a⋅b').toString().should.equal(new Expression('a*b').toString());
    });

    it('should allow space for multiplication', () => {
        new Expression('m kg s⁻²').should.eql(new Expression('m * kg * s^-2'));
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

        x.resolve(symbol => defs[symbol]).toString().should.equal('-1+2+x²');
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

    describe('Polish notation', () => {

        it('should convert to polish and reverse polish notation', () => {
            new Expression('(a + b) / (c^(z+n))').toPolish().should.equal('/ + a b ^ c + z n');
            new Expression('(a + b) / (c^(z+n))').toReversePolish().should.equal('a b + c z n + ^ /');
        });

        it('should treat unary minus as 0 - value', () => {
            new Expression('-a').toPolish().should.equal('- 0 a');
            new Expression('-a').toReversePolish().should.equal('0 a -');
        });

        it('should allow numeric literals', () => {
            new Expression('a + 20').toPolish().should.equal('+ a 20');
            new Expression('a + 20').toReversePolish().should.equal('a 20 +');
        });

    });

    describe('Evaluation', () => {
        it('should return a value', () => {
            let x = new Expression('(a + b) * -a'),
                defs = {
                    a: new Expression('1'),
                    b: new Expression('a + a')
                };
            x
                .resolve(symbol => defs[symbol])
                .evaluate()
                .should.equal(-3);
        });

        it('should process unary operators', () => {
            let x = new Expression('+a * -b'),
                defs = {
                    a: 1,
                    b: 2
                };
            x
                .resolve(symbol => defs[symbol])
                .evaluate()
                .should.equal(-2);
        });

        it('should process binary operators', () => {
            new Expression('1 + 2').evaluate().should.equal(3);
            new Expression('1 - 2').evaluate().should.equal(-1);
            new Expression('4 / 2').evaluate().should.equal(2);
            new Expression('2 * 3').evaluate().should.equal(6);
            new Expression('2 × 3').evaluate().should.equal(6);
            new Expression('2 ⋅ 3').evaluate().should.equal(6);
            new Expression('3^2').evaluate().should.equal(9);
            new Expression('3**2').evaluate().should.equal(9);
        });

        it('should throw on unresolved identifier', () => {
            (function() { new Expression('a').evaluate();} ).should.throw("'a' is undefined");
        });

        it('should throw on empty expression', () => {
           (function() { new Expression('  '); }).should.throw("Empty expression is not allowed");
        });

    });

});
