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
    server = newServer as Server
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

  it(`should return same index.html from ${env.APP_PUBLIC_URL} as from ${env.APP_PROXY_URL} (proxy)`, async () => {
    const response = await fetch(env.APP_PUBLIC_URL)
    const html = await response.text()

    const responseProxy = await fetch(env.APP_PROXY_URL)
    const htmlProxy = await responseProxy.text()

    expect(html).toEqual(htmlProxy)
  })
})
