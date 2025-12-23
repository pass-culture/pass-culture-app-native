const ALLOWED_JSX_TAGS = [
  /^.*Text$/,
  /^StyledBody.*$/,
  /^(Styled)?(Title[1-4]|Body(Accent(S|Xs)?)?|ButtonText(NeutralInfo|Primary|Secondary)?|Caption(NeutralInfo|Primary|Secondary)?)$/,
]

const WHITESPACES_REGEX = /^\s*$/

const checkJSXTextAreEmpty = (child) =>
  child.type !== 'JSXText' || (child.type === 'JSXText' && WHITESPACES_REGEX.test(child.value))

const conditions = [
  {
    check: (openingElement) => openingElement?.object?.name === 'Typo',
    message: 'Typo',
  },
  {
    check: (openingElement) => ALLOWED_JSX_TAGS.some((value) => value.test(openingElement.name)),
    message: 'allowed JSX tag',
  },
]

module.exports = {
  name: 'no-raw-text',
  meta: {
    docs: {
      description:
        'We use a custom no-raw-text instead react-native/no-raw-text because we have some specific text tags',
    },
  },
  create(context) {
    return {
      JSXElement: (node) => {
        const openingElement = node.openingElement.name

        for (const condition of conditions) {
          if (condition.check(openingElement)) return
        }

        if (node.children.every(checkJSXTextAreEmpty)) return

        const allowedTags = conditions.map((condition) => `<${condition.message}.***>`).join(', ')

        return context.report({
          node,
          message: `No raw text outside tags <Text>, ${allowedTags}. \n *** = all exported Typo in src/ui/theme/typography.tsx`,
        })
      },
    }
  },
}
