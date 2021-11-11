const LINEAR_GRADIENT_ID_REGEX = /"openingElement":{[^[\]{}]*"name":{[^[\]{}]*"linearGradient[^[\]{}]*}[^[\]{}]*"attributes":\[{[^[\]{}]*"name":{[^[\]{}]*id"}[^[\]{}]*"value":{[^[\]{}]*"value":"([^[\]{}]*)"[^[\]{}]*/g
const RADIAL_GRADIENT_ID_REGEX = /"openingElement":{[^[\]{}]*"name":{[^[\]{}]*"radialGradient[^[\]{}]*}[^[\]{}]*"attributes":\[{[^[\]{}]*"name":{[^[\]{}]*id"}[^[\]{}]*"value":{[^[\]{}]*"value":"([^[\]{}]*)"[^[\]{}]*/g

const BICOLOR_SVG_IMPORT = "import { svgIdentifier } from 'ui/svg/utils'"

const nthVariable = (i) => (i == 0 ? '' : `${i + 1}`)
const getIdVariable = (nth) => `gradientId${nthVariable(nth)}`
const getFillVariable = (nth) => `gradientFill${nthVariable(nth)}`

const getSvgWithIdsBody = (numberOfIds) =>
  [...Array(numberOfIds).keys()]
    .map((i) => `const { id: ${getIdVariable(i)}, fill: ${getFillVariable(i)} } = svgIdentifier()`)
    .join('\n')

function updateStringJSXForBicolorSvg(initStringJsx, gradientId, nth) {
  const idVariable = getIdVariable(nth)
  const fillVariable = getFillVariable(nth)
  let stringJsx = initStringJsx
  const oldFillElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"fill"},"value":{"type":"StringLiteral","value":"url(#${gradientId})"}}`
  const newFillElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"fill"},"value":{"type":"JSXExpressionContainer","expression":{"type":"Identifier","name":"${fillVariable}"}}}`
  stringJsx = stringJsx.replace(oldFillElement, newFillElement)
  const oldLinearGradientElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"id"},"value":{"type":"StringLiteral","value":"${gradientId}"}}`
  const newLinearGradientElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"id"},"value":{"type":"JSXExpressionContainer","expression":{"type":"Identifier","name":"${idVariable}"}}}`
  return stringJsx.replace(oldLinearGradientElement, newLinearGradientElement)
}

function template({ template }, opts, { imports, componentName, jsx: initJsx }) {
  const plugins = ['jsx', 'typescript']
  const typeScriptTpl = template.smart({ plugins, retainLines: true, compact: false })

  let jsx = initJsx
  let stringJsx = JSON.stringify(jsx)
  const linearGradientRegexMatch = [...stringJsx.matchAll(LINEAR_GRADIENT_ID_REGEX)]
  const radialGradientRegexMatch = [...stringJsx.matchAll(RADIAL_GRADIENT_ID_REGEX)]
  const ids = {
    linearGradients: linearGradientRegexMatch.map((match) => match[1]),
    radialGradients: radialGradientRegexMatch.map((match) => match[1]),
  }
  const numberOfIds = [...ids.linearGradients, ...ids.radialGradients].length
  const isBicolor = numberOfIds > 0

  ids.linearGradients.forEach((id, i) => {
    stringJsx = updateStringJSXForBicolorSvg(stringJsx, id, i)
  })
  ids.radialGradients.forEach((id, index) => {
    const i = ids.linearGradients.length + index
    stringJsx = updateStringJSXForBicolorSvg(stringJsx, id, i)
  })
  if (isBicolor) jsx = JSON.parse(stringJsx)

  return typeScriptTpl.ast`${imports}
  ${'\n'}
  ${isBicolor ? BICOLOR_SVG_IMPORT : ''}
  import { ColorsEnum } from 'ui/theme'
  ${'\n'}
  import { IconInterface } from './types'
  ${'\n'}
  export const ${componentName} = ({
    size = 32,
    color = ColorsEnum.BLACK,
    testID,
  }: IconInterface) => {
    ${isBicolor ? getSvgWithIdsBody(numberOfIds) : ''}
  return ${jsx}
}`
}

module.exports = template
