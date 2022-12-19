import { getIsE2e } from '../getIsE2e'

describe('getIsE2e web', () => {
  it('should return true when navigator.webdriver is true', async () => {
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = true
    expect(await getIsE2e()).toBeTruthy()
  })
  it('should return false when navigator.webdriver is false', async () => {
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = false
    expect(await getIsE2e()).toBeFalsy()
  })
  it('should return true when navigator.webdriver is false but window.webdriver is set (iOS Safari workaround)', async () => {
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = false
    globalThis.window.webdriver = true
    expect(await getIsE2e()).toBeTruthy()
  })
})
