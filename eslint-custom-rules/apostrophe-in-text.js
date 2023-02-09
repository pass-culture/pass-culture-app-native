/**
 * @fileoverview Rule to disallow single quotes in text
 * @author Donovan BENFOUZARI
 */

"use strict";

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
            useApostrophe: "Please use ‘ apostrophe instead of '",
        },
        fixable: 'code',
        hasSuggestions: true,
    },
    create(context) {
        return {
            "Literal[value=/'/]": node => {
                context.report({
                    node,
                    messageId: 'useApostrophe',
                    fix(fixer) {
                        const textToReplace = node.raw.replace(/'/, '‘')
                        return fixer.replaceText(node, textToReplace)
                    }
                })
            }
        }
    },
}
