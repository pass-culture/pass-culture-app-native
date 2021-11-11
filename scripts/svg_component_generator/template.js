const LINEAR_GRADIENT_ID_REGEX = /"openingElement":{[^[\]{}]*"name":{[^[\]{}]*"linearGradient[^[\]{}]*}[^[\]{}]*"attributes":\[{[^[\]{}]*"name":{[^[\]{}]*id"}[^[\]{}]*"value":{[^[\]{}]*"value":"([^[\]{}]*)"[^[\]{}]*/

const BICOLOR_SVG_IMPORT = "import { svgIdentifier } from 'ui/svg/utils'"
const BICOLOR_SVG_BODY = 'const { id: gradientId, fill: gradientFill } = svgIdentifier()'

function updateStringJSXForBicolorSvg(initStringJsx, linearGradientId) {
  let stringJsx = initStringJsx
  const oldFillElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"fill"},"value":{"type":"StringLiteral","value":"url(#${linearGradientId})"}}`
  const newFillElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"fill"},"value":{"type":"JSXExpressionContainer","expression":{"type":"Identifier","name":"gradientFill"}}}`
  stringJsx = stringJsx.replace(oldFillElement, newFillElement)
  const oldLinearGradientElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"id"},"value":{"type":"StringLiteral","value":"${linearGradientId}"}}`
  const newLinearGradientElement = `{"type":"JSXAttribute","name":{"type":"JSXIdentifier","name":"id"},"value":{"type":"JSXExpressionContainer","expression":{"type":"Identifier","name":"gradientId"}}}`
  return stringJsx.replace(oldLinearGradientElement, newLinearGradientElement)
}

function template({ template }, opts, { imports, componentName, jsx: initJsx }) {
  const plugins = ['jsx', 'typescript']
  const typeScriptTpl = template.smart({ plugins, retainLines: true, compact: false })

  let jsx = initJsx
  let stringJsx = JSON.stringify(jsx)
  const regexMatch = stringJsx.match(LINEAR_GRADIENT_ID_REGEX)
  const isBicolor = regexMatch && regexMatch.length > 1
  if (isBicolor) {
    const linearGradientId = regexMatch[1]
    stringJsx = updateStringJSXForBicolorSvg(stringJsx, linearGradientId)
    jsx = JSON.parse(stringJsx)
  }

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
    ${isBicolor ? BICOLOR_SVG_BODY : ''}
  return ${jsx}
}`
}

module.exports = template
