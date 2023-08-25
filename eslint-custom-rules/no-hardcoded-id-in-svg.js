const SVGElementsToAvoid = ['ClipPath', 'Filter', 'LinearGradient', 'Marker', 'Mask', 'Pattern', 'RadialGradient', 'Symbol']

module.exports = {
  meta: {
    docs: {
      description:
        'With hardcoded id in svg we can have displaying issues when there is a duplicated id in the DOM',
    },
  },
  create(context) {
    return {
      JSXOpeningElement: (node) => {
        if (SVGElementsToAvoid.includes(node.name.name)) {
          node.attributes.forEach((attribute) => {
            if (attribute.name.name === 'id' && attribute.value.type === 'Literal') {
              context.report({
                node,
                message: 'Please use svgIdentifier instead of hardcoded id',
              })
            }
          })
        }
      },
    }
  },
}
