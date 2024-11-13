module.exports = {
  name: 'no-direct-consult-offer-log',
  meta: {
    docs: {
      description: 'Use `triggerConsultOfferLog` rather than `analytics.logConsultOffer`',
      recommended: true,
      url: 'https://eslint.org/docs/rules/',
    },
    fixable: 'code',
  },
  create(context) {
    const filename = context.getFilename()

    if (filename.includes('triggerConsultOfferLog.ts')) {
      return {}
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'analytics' &&
          node.callee.property.name === 'logConsultOffer'
        ) {
          context.report({
            node,
            message: 'Use `triggerConsultOfferLog` rather than `analytics.logConsultOffer`',
          })
        }
      },
    }
  },
}
