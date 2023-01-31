import { getIsE2e } from '../getIsE2e'

describe('getIsE2e web', () => {
  it('should return true when navigator.webdriver is true', async () => {
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = true
    expect(await getIsE2e()).toBeTruthy()
  })
})
