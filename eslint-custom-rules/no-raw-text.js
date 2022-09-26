const ALLOWED_JSX_TAGS = [
  /^.*Text$/,
  /^Styled+(Hero|Title[1-4]|Body|ButtonText(|NeutralInfo|Primary|Secondary)|Caption(|Primary|Secondary))$/,
]

const WHITESPACES_REGEX = /^\s+$/

const checkJSXTextAreEmpty = (child) =>
  child.type !== 'JSXText' || (child.type === 'JSXText' && WHITESPACES_REGEX.test(child.value))

module.exports = {
  name: 'no-raw-text',
  meta: {
    docs: {
      description: 'blablabla',
    },
  },
  create(context) {
    return {
      JSXElement: (node) => {
        const openingElement = node.openingElement.name

        if (openingElement.object && openingElement.object.name === 'Typo') return
        if (ALLOWED_JSX_TAGS.some((value) => value.test(openingElement.name))) return
        if (node.children.every(checkJSXTextAreEmpty)) return

        return context.report({
          node,
          message: `No raw text outside tags <Text>, <Typo.***>, <Styled***> or tag with prefix 'Text'. \n *** = all exported Typo in src/ui/theme/typography.tsx`,
        })
      },
    }
  },
}
