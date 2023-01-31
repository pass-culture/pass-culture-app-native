import { getIsE2e } from '../getIsE2e'

describe('getIsE2e web false', () => {
  it('should return false when navigator.webdriver is false', async () => {
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = false
    expect(await getIsE2e()).toBeFalsy()
  })
})
