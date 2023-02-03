import { getIsE2e } from '../getIsE2e'

describe('getIsE2e web ios safari workaround', () => {
  it('should return true when navigator.webdriver is false but window.webdriver is set (iOS Safari workaround)', async () => {
    jest.setTimeout(6000)
    process.env.NODE_ENV = 'development'
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = false
    globalThis.window.webdriver = true
    expect(await getIsE2e()).toBeTruthy()
    process.env.NODE_ENV = 'test'
  })
})
