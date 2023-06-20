import { Server } from 'http'
import { AddressInfo } from 'net'

import { env } from './libs/environment/__mocks__/env'

describe('express server', () => {
  let server: Server
  let initialEnv: string | undefined

  beforeAll(async () => {
    initialEnv = process.env.ENV
    process.env.ENV = 'testing'
    const { server: newServer } = await import('./index')
    server = newServer
  })

  afterAll((done) => {
    process.env.ENV = initialEnv
    server.close(done)
  })

  it(`should listen on port 8080`, () => {
    const addressInfo = server.address() as AddressInfo
    expect(server.listening).toBe(true)
    expect(addressInfo.port).toBe(8080)
  })

  it(`should return same index.html from proxy ${env.APP_PUBLIC_URL} as from bucket ${env.APP_BUCKET_URL} (minus the chunk and commit hash)`, async () => {
    const scriptWithChunkRegExp = /\/(\d|main)\.[0-9a-f]+(\.chunk\.js)/gm
    const chunkInScriptRegExp = /return .+?static\/js\/.+?\.chunk\.js.+?"/gm
    const commitHashRegExp = /<meta name="commit-hash".*?>/gm
    const versionRegExp = /<meta name="version" content=".+?"\/>/gm
    const response = await fetch(env.APP_PUBLIC_URL)
    const html = (await response.text())
      .replace(scriptWithChunkRegExp, '/$1$2')
      .replace(chunkInScriptRegExp, '')
      .replace(commitHashRegExp, '')
      .replace(versionRegExp, '')
    const responseProxy = await fetch(env.APP_BUCKET_URL)
    const htmlProxy = (await responseProxy.text())
      .replace(scriptWithChunkRegExp, '/$1$2')
      .replace(chunkInScriptRegExp, '')
      .replace(commitHashRegExp, '')
      .replace(versionRegExp, '')
    expect(html).toEqual(htmlProxy)
  })
})
