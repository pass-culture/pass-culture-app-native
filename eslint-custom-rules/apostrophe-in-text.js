/**
 * @fileoverview Rule to disallow single quotes in text
 * @author Donovan BENFOUZARI
 */

"use strict";

function buildTree(...args) {
    return args.join(' > ') + " > Literal[value=/'/]"
}

function isTemplateLiteralParentStyledComponents(node) {
    return node.parent.parent.type === "TaggedTemplateExpression" && node.parent.parent.tag.object.name === "styled"
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    name: 'apostrophe-in-text',
    meta: {
        type: "suggestion",
        docs: {
            description: 'force the use of apostrophe instead of single quote',
            recommended: true,
        },
        messages: {
            useApostrophe: 'Replace "{{ before }}" with "{{ after }}"',
        },
        fixable: 'code',
        hasSuggestions: true,
    },
    create(context) {
        const handler = (node, autofix = true) => {
            // Returns problematic word in the string literal
            const word = node.raw.match(/([A-zÀ-ú]+'[A-zÀ-ú]+)/)[0]

            context.report({
                node,
                messageId: 'useApostrophe',
                fix(fixer) {
                    const textToReplace = node.raw.replace(/'/, '’')
                    return fixer.replaceText(node, textToReplace)
                },
                data: {
                    before: word,
                    after: word.replace(/'/, '‘')
                }
            })
        }

        return {
            [buildTree("JSXAttribute")]: handler,
            [buildTree("ObjectExpression", "Property")]: handler,
            [buildTree("ReturnStatement")]: handler,
            [buildTree("ObjectExpression", "Property", "ArrayExpression")]: handler,
            [buildTree("CallExpression[callee.name=getByText]")]: handler,
            [buildTree("CallExpression[callee.name=queryByText]")]: handler,
            [buildTree("VariableDeclarator")]: handler,
            "TemplateLiteral > TemplateElement[value.raw=/'/]": node => {
                // This one cannot be automatically fixes since it destroys the initial value.
                // Find a way to fix it correctly or let it as it is.

                // Do not handle `styled-components` template literals.
                if (isTemplateLiteralParentStyledComponents(node)) return

                const word = node.value.raw.match(/([A-zÀ-ú]+'[A-zÀ-ú]+)/)[0]

                context.report({
                    node,
                    messageId: 'useApostrophe',
                    data: {
                        before: node.value.raw,
                        after: node.value.raw.replace(/'/, '’')
                    }
                })
            },
        }
    },
}
