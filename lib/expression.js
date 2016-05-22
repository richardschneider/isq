'use strict';

let jsep = require('jsep');

// Only algebraic expressions.
['!', '~'].forEach(jsep.removeUnaryOp);
['||', '&&', '|', '^', '&', '<<', '>>', '>>>'].forEach(jsep.removeBinaryOp);
['==', '!=', '===', '!==', '<', '>', '<=', '>='].forEach(jsep.removeBinaryOp);
['×', '⋅', ' '].forEach(op => jsep.addBinaryOp(op ,10) );
['^', '**'].forEach(op => jsep.addBinaryOp(op, 11) );

let superscriptMap = {
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

function parse(s) {
    // Transform numeric superscripts into '^x'.
    s = s.replace(/[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
        return '^' + Array.from(match, c => superscriptMap[c]).join('');
    });

    let ast = jsep(s);

    // Hack to allow implied multiplication with a space, such as 'a b'.
    // TODO: Doesn't cope with subexpressions, such as 'x + (a b)'.
    if (ast.type === 'Compound') {
        let body = ast.body;
        ast = { type: 'BinaryExpression', operator: '×' };
        body.forEach(term => {
            if (ast.left && ast.right) {
                ast = {
                    type: ast.type,
                    operator: ast.operator,
                    left: ast
                };
            }
            if (!ast.left) ast.left = term;
            else ast.right = term;
        });
    }

    return ast;
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
        let s = format(node, node.left, opts) + canonicalOperator(node.operator) + format(node, node.right, opts),
            needParens = precedence(parent) > precedence(node);
        return needParens
            ? '(' + s + ')'
            : s;
    }
    if (node.type === 'UnaryExpression')
        return node.prefix
            ? node.operator + format(node, node.argument, opts)
            : format(node, node.argument, opts) + node.operator;

    throw Error('Unknown expression type: ' + node.type);
};

function Expression(s) {
    // Parse the string into an AST.
    if (typeof s === 'string')
        this.ast = parse(s);

    // Clone (shallow copy) the expression.
    if (s instanceof Expression)
        Object.assign(this, s);
}

/**
 * Returns the string representation of the Expression.
 */
Expression.prototype.toString = function(options) {
    return format(null, this.ast, options || {});
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
        return node.operator + ' ' + this.toPolish(node.argument);
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
        return this.toReversePolish(node.argument) + ' ' + node.operator;
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
