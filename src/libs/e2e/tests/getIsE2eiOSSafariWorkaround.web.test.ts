import { getIsE2e } from '../getIsE2e'

describe('getIsE2e web ios safari workaround', () => {
  it('should return true when navigator.webdriver is false but appium server is up (iOS Safari workaround)', async () => {
    process.env.NODE_ENV = 'development'
    // @ts-expect-error : `webdriver` is a read-only property
    globalThis.navigator.webdriver = false
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)
    expect(await getIsE2e()).toBeTruthy()
    process.env.NODE_ENV = 'test'
  })
})
