module.exports = {
  meta: {
    docs: {
      description: 'Disallow direct import of `theme` and suggest using `useTheme` hook',
    },
    messages: {
      noDirectThemeImport:
        "Do not import `{ theme }` directly from 'theme'. Instead, use the `useTheme` hook from 'styled-components/native'.",
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'theme') {
          return
        }

        const themeSpecifier = node.specifiers.find(
          (specifier) => specifier.type === 'ImportSpecifier' && specifier.imported.name === 'theme'
        )

        if (themeSpecifier) {
          context.report({
            node: themeSpecifier,
            messageId: 'noDirectThemeImport',
          })
        }
      },
    }
  },
}
