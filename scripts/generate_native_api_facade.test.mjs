import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const generator = fileURLToPath(new URL('./generate_native_api_facade.mjs', import.meta.url))

function generateWithParameter(parameter) {
  const directory = mkdtempSync(join(tmpdir(), 'native-api-facade-'))
  try {
    mkdirSync(join(directory, 'src/api/gen'), { recursive: true })
    writeFileSync(
      join(directory, 'src/api/gen/models.gen.ts'),
      `export interface LegacyApiSignatures {
        getNativeV1Me(options?: RequestInit): Promise<unknown>
        postNativeV1RefreshAccessToken(options?: RequestInit): Promise<unknown>
      }`
    )
    writeFileSync(
      join(directory, 'schema.json'),
      JSON.stringify({
        paths: {
          '/native/v1/me': {
            get: { operationId: 'getNativeV1Me', parameters: [parameter] },
          },
        },
      })
    )
    const output = execFileSync(process.execPath, [generator], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, NATIVE_API_OPENAPI_URL: './schema.json' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    mkdirSync(join(directory, 'src/api/hey-api-gen'))
    writeFileSync(
      join(directory, 'src/api/hey-api-gen/types.gen.ts'),
      `export type getNativeV1MeData = {
        query?: { includeDetails?: boolean }; headers?: { 'X-Header'?: string }
      }`
    )
    writeFileSync(
      join(directory, 'src/api/hey-api-gen/sdk.gen.ts'),
      `export type Options<T, U> = { data?: T; flag?: U }
       export declare function getNativeV1Me(options: {
         query?: { includeDetails?: boolean }; headers?: HeadersInit; credentials?: string
       }): Promise<unknown>`
    )
    writeFileSync(
      join(directory, 'src/api/consumer.ts'),
      `import { nativeApi } from './nativeApi.gen'
       nativeApi.getNativeV1Me()
       nativeApi.getNativeV1Me(undefined, ${parameter.in === 'header' ? "'value'" : 'true'})
       // @ts-expect-error The schema parameter has a different type.
       nativeApi.getNativeV1Me(undefined, ${parameter.in === 'header' ? 'true' : "'invalid'"})`
    )
    const program = ts.createProgram([join(directory, 'src/api/consumer.ts')], {
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      types: [],
      target: ts.ScriptTarget.ES2022,
    })
    const diagnostics = ts.getPreEmitDiagnostics(program)
    assert.deepEqual(
      diagnostics.map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      ),
      []
    )
    return { output, facade: readFileSync(join(directory, 'src/api/nativeApi.gen.ts'), 'utf8') }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('binds new optional parameters after legacy arguments without exposing removed methods', () => {
  const { facade } = generateWithParameter({
    name: 'includeDetails',
    in: 'query',
    required: false,
  })

  assert.match(facade, /parameter0\?: NonNullable<ApiTypes\.getNativeV1MeData\['query'\]>/)
  assert.match(facade, /const \[options, parameter0\] = args/)
  assert.match(facade, /query: \{ "includeDetails": parameter0 \}/)
  assert.doesNotMatch(facade, /postNativeV1RefreshAccessToken/)
  assert.match(facade, /export const nativeApi = \{/)
})

test('rejects new required parameters that cannot be bound to the legacy signature', () => {
  assert.throws(
    () => generateWithParameter({ name: 'includeDetails', in: 'query', required: true }),
    /required parameters missing from LegacyApiSignatures/
  )
})

test('binds a new optional header using the SDK header type', () => {
  const { facade } = generateWithParameter({
    name: 'X-Header',
    in: 'header',
    required: false,
  })

  assert.match(facade, /NonNullable<ApiTypes\.getNativeV1MeData\['headers'\]>/)
  assert.match(facade, /headers\.set\("X-Header", String\(parameter0\)\)/)
})

test('rejects cookie parameters not represented in SDK types', () => {
  assert.throws(
    () => generateWithParameter({ name: 'session', in: 'cookie', required: false }),
    /cookie parameters are not supported by the generated SDK/
  )
})
