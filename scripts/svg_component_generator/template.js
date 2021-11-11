function template({ template }, opts, { imports, componentName, jsx }) {
  const plugins = ['jsx', 'typescript']
  const typeScriptTpl = template.smart({ plugins, retainLines: true, compact: false })
  return typeScriptTpl.ast`${imports}
  ${'\n'}
  import { ColorsEnum } from 'ui/theme'
  ${'\n'}
  import { IconInterface } from './types'
  ${'\n'}
  export const ${componentName} = ({
    size = 32,
    color = ColorsEnum.BLACK,
    testID,
  }: IconInterface) => ${jsx}`
}

module.exports = template
