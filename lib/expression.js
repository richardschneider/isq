'use strict';

let jsep = require('jsep'),
    config = require('./config');

// Only algebraic expressions.
['!', '~'].forEach(jsep.removeUnaryOp);
['||', '&&', '|', '^', '&', '<<', '>>', '>>>'].forEach(jsep.removeBinaryOp);
['==', '!=', '===', '!==', '<', '>', '<=', '>='].forEach(jsep.removeBinaryOp);
['×', '⋅', ' '].forEach(op => jsep.addBinaryOp(op ,10) );
['^', '**'].forEach(op => jsep.addBinaryOp(op, 11) );

let superscriptToDigit = {
    '⁰': 0,
    '¹': 1,
    '²': 2,
    '³': 3,
    '⁴': 4,
    '⁵': 5,
    '⁶': 6,
    '⁷': 7,
    '⁸': 8,
    '⁹': 9,
    '⁻': '-',
    '⁺': '+'
};

let digitToSuperscript = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
    '+': '⁺'
};

function quirks(node) {
    if (node.type === 'BinaryExpression') {
        node.left = quirks(node.left);
        node.right = quirks(node.right);
    }

     // Transform <unary minus> <literal> into <literal>
    if (node.type === 'UnaryExpression' && node.operator === '-' && node.argument.type == 'Literal') {
        node = node.argument;
        node.value = node.value.times(-1);
        node.raw = '-' + node.raw;
    }

    if (node.type === 'UnaryExpression') {
        node.argument = quirks(node.argument);
    }

    return node;
}

function parse(s, options) {

    // Transform numeric superscripts into '^x'.
    s = s.replace(/[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
        return '^' + Array.from(match, c => superscriptToDigit[c]).join('');
    });

    let ast = jsep(s, config.options.merge(options));

    return quirks(ast);
}

let unaryFns = {
    '+': a => a,
    '-': a => a.times(-1),
    '%': a => a.times(0.01)
};

let binaryFns = {
    '+': (a,b) => a.plus(b),
    '-': (a,b) => a.minus(b),
    '/': (a,b) => a.dividedBy(b),
    '*': (a,b) => a.times(b),
    '×': (a,b) => a.times(b),
    '⋅': (a,b) => a.times(b),
    '^': (a,b) => a.pow(b.toNumber()),
    '**': (a,b) => a.pow(b.toNumber())
};

function evaluate(node, unaryOps, binaryOps) {
    if (node.type === 'Identifier')
        throw new Error("'" + node.name + "' is undefined");
    if (node.type === 'Literal')
        return node.value;
    if (node.type === 'BinaryExpression') {
        let left = evaluate(node.left, unaryOps, binaryOps),
            right = evaluate(node.right, unaryOps, binaryOps);
        return binaryOps[node.operator](left, right);
    }
    if (node.type === 'UnaryExpression') {
        let a = evaluate(node.argument, unaryOps, binaryOps);
        return unaryOps[node.operator](a);
    }

    throw new Error("Expression type '" + node.type + "' is not known");
}

let canonicalOps = {
    '*': '×',
    '⋅': '×',
    '**': '^'
};

function canonicalOperator(op) {
    return canonicalOps[op] || op;
}

let precedences = {
    '+': 9, '-': 9,
    '*': 10, '/': 10, '×': 10, '⋅': 10,
    '^': 11, '**': 11
};

function precedence(node) {
    if (!node)
        return 0;

    if (node.type == 'BinaryExpression')
        return precedences[node.operator] || 99;

    return 0;
}

function format(parent, node, opts) {
    if (node.type === 'Identifier')
        return node.name;
    if (node.type === 'Literal')
        return node.value.toString();
    if (node.type === 'BinaryExpression') {
        let op = canonicalOperator(node.operator),
            left = format(node, node.left, opts),
            right = format(node, node.right, opts);

        if (op === canonicalOperator('*') && !!opts.multiplicationMark)
            op = opts.multiplicationMark;
        else if (op === canonicalOperator('^') && !!opts.unicodeSuperscript && node.right.type === 'Literal') {
            op = '';
            right = Array.from(right, c => digitToSuperscript[c]).join('');
        }
        else if (op === canonicalOperator('^') && !!opts.exponentMark)
            op = opts.exponentMark;

        let s =  left + op + right,
            needParens = precedence(parent) > precedence(node);
        return needParens
            ? '(' + s + ')'
            : s;
    }
    if (node.type === 'UnaryExpression')
        return node.prefix
            ? node.operator + format(node, node.argument, opts)
            : format(node, node.argument, opts) + node.operator;

    throw new Error("Expression type '" + node.type + "' is not known");
}

function Expression(s, options) {
    // Parse the string into an AST.
    if (typeof s === 'string')
        this.ast = parse(s, options);

    // Clone (shallow copy) the expression.
    if (s instanceof Expression)
        Object.assign(this, s);
}

/**
 * Returns the string representation of the Expression.
 */
Expression.prototype.toString = function(options) {
    return format(null, this.ast, config.options.merge(options));
};

/**
 * Evaluate the expression.
 */
Expression.prototype.evaluate = function(unaryOps, binaryOps) {
    return evaluate(this.ast, unaryOps || unaryFns, binaryOps || binaryFns);
};

/**
 * Returns the Polish Notation of the Expression as a string.
 */
Expression.prototype.toPolish = function(node) {
    node = node || this.ast;

    if (node.type === 'Identifier')
        return node.name;
    if (node.type === 'Literal')
        return node.value.toString();
    if (node.type === 'BinaryExpression')
        return node.operator + ' ' + this.toPolish(node.left) + ' ' + this.toPolish(node.right);
    if (node.type === 'UnaryExpression')
        return node.operator + ' 0 ' + this.toPolish(node.argument);
};

/**
 * Returns the Reverse Polish Notation of the Expression as a string.
 */
Expression.prototype.toReversePolish = function(node) {
    node = node || this.ast;

    if (node.type === 'Identifier')
        return node.name;
    if (node.type === 'Literal')
        return node.value.toString();
    if (node.type === 'BinaryExpression')
        return  this.toReversePolish(node.left) + ' ' +
                this.toReversePolish(node.right) + ' ' +
                node.operator;
    if (node.type === 'UnaryExpression')
        return '0 ' + this.toReversePolish(node.argument) + ' ' + node.operator;
};

/**
 * Returns a new Expression with resolved identifiers.
 */
Expression.prototype.resolve = function(resolver, node) {
    if (!node) {
        node = new Expression(this);
        node.ast = this.resolve(resolver, this.ast);
        return node;
    }

    if (node.type === 'Identifier') {
        let v = resolver(node.name);

        if (typeof v === 'undefined')
            return node;

        if (v instanceof Expression)
            return v.resolve(resolver).ast;

        return {
            type: 'Literal',
            raw: node.name,
            value: v
        };
    }

    if (node.type === 'UnaryExpression') {
        node = Object.assign({}, node);
        node.argument = this.resolve(resolver, node.argument);
    }

    else if (node.type === 'BinaryExpression') {
        node = Object.assign({}, node);
        node.left = this.resolve(resolver, node.left);
        node.right = this.resolve(resolver, node.right);
    }

    return node;
};

/*
 * Exports the constructor for an Expression.
 */
module.exports = Expression;
