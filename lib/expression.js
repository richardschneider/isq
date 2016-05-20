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

function Expression(s) {
    this.ast = parse(s);
}

/**
 * Returns the string representation of the Expression.
 */
Expression.prototype.toString = function(node) {
    node = node || this.ast;

    if (node.type === 'Identifier')
        return node.name;
    if (node.type === 'Literal')
        return node.raw;
    if (node.type === 'BinaryExpression')
        return '(' +  this.toString(node.left) + canonicalOperator(node.operator) + this.toString(node.right) + ')';

    if (node.type === 'UnaryExpression')
        return node.prefix
            ? node.operator + this.toString(node.argument)
            : this.toString(node.argument) + node.operator;

    throw Error('Unknown expression type: ' + node.type);
};


/*
 * Exports the constructor for an Expression.
 */
module.exports = Expression;
