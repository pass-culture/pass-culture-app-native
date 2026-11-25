import { readFile, writeFile } from 'node:fs/promises'

import ts from 'typescript'

/* eslint-disable local-rules/apostrophe-in-text */

const schemaUrl =
  process.env.NATIVE_API_OPENAPI_URL ??
  'https://backend.testing.passculture.team/native/openapi.json'
const outputPath = 'src/api/nativeApi.gen.ts'

function resolveReference(document, value) {
  if (!value?.$ref?.startsWith('#/')) return value
  return value.$ref
    .slice(2)
    .split('/')
    .reduce((current, key) => current?.[key], document)
}

function pascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function camelCase(value) {
  const result = pascalCase(value)
  return result.charAt(0).toLowerCase() + result.slice(1)
}

function sdkName(operationId) {
  const [first, ...rest] = operationId.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  return first + rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

function legacyName(method, path) {
  const suffix = path
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      const pathParameter = segment.match(/^\{(.+)\}$/)
      return pathParameter ? camelCase(pathParameter[1]) : pascalCase(segment)
    })
    .join('')
  return method.toLowerCase() + suffix
}

let document
if (schemaUrl.startsWith('http://') || schemaUrl.startsWith('https://')) {
  const response = await fetch(schemaUrl)
  if (!response.ok) throw new Error(`Failed to fetch ${schemaUrl}: HTTP ${response.status}`)
  document = await response.json()
} else {
  document = JSON.parse(await readFile(schemaUrl, 'utf8'))
}
const operations = []
for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'].includes(method)) {
      continue
    }
    if (!operation || typeof operation !== 'object') continue
    if (!operation.operationId)
      throw new Error(`Missing operationId for ${method.toUpperCase()} ${path}`)
    operations.push({ method, path, operation, pathItem })
  }
}

const names = new Set()
const legacyModelsPath = 'src/api/gen/models.gen.ts'
const legacyModelsText = await readFile(legacyModelsPath, 'utf8')
const legacyModelsSource = ts.createSourceFile(
  legacyModelsPath,
  legacyModelsText,
  ts.ScriptTarget.Latest,
  true
)
const legacySignatures = legacyModelsSource.statements.find(
  (statement) =>
    ts.isInterfaceDeclaration(statement) && statement.name.text === 'LegacyApiSignatures'
)
const legacyMethods = new Map(
  legacySignatures.members
    .filter(ts.isMethodSignature)
    .map((method) => [method.name.getText(legacyModelsSource).toLowerCase(), method])
)

const generatedMethods = operations.map(({ method, path, operation, pathItem }) => {
  const generatedName = legacyName(method, path)
  const legacyMethod = legacyMethods.get(generatedName.toLowerCase())
  const methodName = legacyMethod?.name.getText(legacyModelsSource) ?? generatedName
  if (names.has(methodName)) throw new Error(`Duplicate native API method: ${methodName}`)
  names.add(methodName)

  const operationSdkName = sdkName(operation.operationId)
  const dataType = `ApiTypes.${operationSdkName}Data`

  const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])].map(
    (parameter) => resolveReference(document, parameter)
  )
  const groups = { path: [], query: [], header: [], cookie: [] }
  let parameterIndex = 0
  for (const parameter of parameters) {
    if (!groups[parameter.in]) continue
    if (
      parameter.in === 'cookie' &&
      !legacyMethod?.parameters.some(
        (candidate) => candidate.name.getText(legacyModelsSource) === parameter.name
      )
    ) {
      throw new Error(`${methodName}: cookie parameters are not supported by the generated SDK`)
    }
    groups[parameter.in].push({
      name: parameter.name,
      argument: `parameter${parameterIndex++}`,
      required: parameter.required ?? false,
    })
  }
  for (const group of Object.values(groups)) {
    group.sort((left, right) => Number(right.required) - Number(left.required))
  }

  const requestBody = resolveReference(document, operation.requestBody)

  const legacyArgumentNames = new Set(
    legacyMethod?.parameters.map((parameter) => parameter.name.getText(legacyModelsSource))
  )
  const additionalArguments = []
  if (legacyMethod) {
    const unbound = []
    for (const [location, group] of Object.entries(groups)) {
      for (const parameter of group) {
        if (legacyArgumentNames.has(parameter.name)) continue
        unbound.push({ name: parameter.name, location, required: parameter.required })
        additionalArguments.push({
          name: parameter.argument,
          type: `NonNullable<${dataType}['${location === 'header' ? 'headers' : location}']>[${JSON.stringify(parameter.name)}]`,
        })
      }
    }
    if (requestBody && !legacyArgumentNames.has('body')) {
      unbound.push({ name: 'body', location: 'body', required: requestBody.required ?? false })
      additionalArguments.push({ name: 'newBody', type: `${dataType}['body']` })
    }

    const describe = (parameters) =>
      parameters.map(({ name, location }) => `${name} (${location})`).join(', ')
    const missingRequired = unbound.filter(({ required }) => required)
    if (missingRequired.length) {
      throw new Error(
        `${methodName}: required parameters missing from LegacyApiSignatures in ${legacyModelsPath}: ${describe(missingRequired)}. Update the signature.`
      )
    }
  }
  const hasBody = Boolean(requestBody)
  const legacyParameters = `Parameters<LegacyApiSignatures['${methodName}']>`
  const additionalTypes = additionalArguments.map(({ name, type }) => `${name}?: ${type}`)
  const args = legacyMethod
    ? [
        `...args: ${additionalTypes.length ? `[...${legacyParameters}, ${additionalTypes.join(', ')}]` : legacyParameters}`,
      ]
    : []
  if (!legacyMethod) {
    if (hasBody) {
      args.push(`body${requestBody.required ? '' : '?'}: ${dataType}['body']`)
    }
    for (const location of ['path', 'query', 'header', 'cookie']) {
      for (const parameter of groups[location]) {
        args.push(
          `${parameter.argument}${parameter.required ? '' : '?'}: NonNullable<${dataType}['${location === 'header' ? 'headers' : location}']>[${JSON.stringify(parameter.name)}]`
        )
      }
    }
    args.push(`options: Omit<Options<${dataType}, true>, 'body' | 'path' | 'query'> = {}`)
  }

  const optionsName =
    legacyMethod?.parameters
      .find((parameter) => parameter.name.getText(legacyModelsSource) === 'options')
      ?.name.getText(legacyModelsSource) ?? 'options'
  const optionsExpression = legacyMethod ? `(${optionsName}\u00a0?? {})` : optionsName
  const properties = [`...${optionsExpression}`]
  const secure = operation.security ?? document.security ?? []
  properties.push(
    `credentials: ${optionsExpression}.credentials\u00a0?? '${secure.length ? 'include' : 'omit'}'`
  )
  const getArgumentName = (parameter) =>
    legacyMethod?.parameters
      .find((candidate) => candidate.name.getText(legacyModelsSource) === parameter.name)
      ?.name.getText(legacyModelsSource) ?? parameter.argument

  if (hasBody) {
    properties.push(
      legacyMethod ? `body: ${legacyArgumentNames.has('body') ? 'body' : 'newBody'}` : 'body'
    )
  }
  for (const location of ['path', 'query']) {
    if (groups[location].length) {
      const values = groups[location]
        .map((parameter) => `${JSON.stringify(parameter.name)}: ${getArgumentName(parameter)}`)
        .join(', ')
      properties.push(`${location}: { ${values} }`)
    }
  }

  const headers = []
  for (const parameter of groups.header) {
    headers.push(
      `if (${getArgumentName(parameter)}\u00a0!== undefined) headers.set(${JSON.stringify(parameter.name)}, String(${getArgumentName(parameter)}))`
    )
  }
  for (const parameter of groups.cookie) {
    headers.push(
      `if (${getArgumentName(parameter)}\u00a0!== undefined) headers.append('Cookie', ${JSON.stringify(parameter.name)} + '=' + encodeURIComponent(String(${getArgumentName(parameter)})))`
    )
  }
  if (headers.length) properties.push('headers')

  const prefix = headers.length
    ? `const headers = new Headers(${optionsExpression}.headers)\n  ` +
      headers.join('\n  ') +
      '\n  '
    : ''
  const returnType = legacyMethod
    ? `ReturnType<LegacyApiSignatures['${methodName}']>`
    : `Promise<ApiTypes.${operationSdkName}Response>`
  const sdkCall = `sdk.${operationSdkName}({ ${properties.join(', ')} })`
  const legacyArguments = legacyMethod
    ? `const [${[...legacyMethod.parameters.map((parameter) => parameter.name.getText(legacyModelsSource)), ...additionalArguments.map(({ name }) => name)].join(', ')}] = args\n  `
    : ''
  return `export const ${methodName} = (${args.join(', ')}): ${returnType} => {\n  ${legacyArguments}${prefix}return ${legacyMethod ? `(${sdkCall} as unknown as ${returnType})` : sdkCall}\n}`
})

const methodNames = generatedMethods.map((method) => method.match(/^export const (\w+)/)?.[1])
const methods = generatedMethods.join('\n\n')
const imports = [
  methods.includes('LegacyApiSignatures') &&
    `import type { LegacyApiSignatures } from './gen/models.gen'`,
  `import * as sdk from './hey-api-gen/sdk.gen'`,
  methods.includes('Options<') && `import type { Options } from './hey-api-gen/sdk.gen'`,
  methods.includes('ApiTypes.') && `import type * as ApiTypes from './hey-api-gen/types.gen'`,
]
  .filter(Boolean)
  .join('\n')
const content = `// This file is auto-generated from the native OpenAPI schema.\n\n${imports}\n\n${methods}\n\nexport const nativeApi = {\n${methodNames.map((name) => `  ${name},`).join('\n')}\n}\n\nexport type NativeApi = typeof nativeApi\n`

await writeFile(outputPath, content)
