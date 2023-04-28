import { getDeviceModelFromUserAgent } from 'features/profile/helpers/TrustedDevices/getDeviceModelFromUserAgent'
import { renderHook } from 'tests/utils'

describe('getDeviceModelFromUserAgent', () => {
  it('should return the device model from the user agent', () => {
    jest
      .spyOn(global.navigator, 'userAgent', 'get')
      .mockReturnValueOnce(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
      )

    const { result } = renderHook(getDeviceModelFromUserAgent)

    expect(result.current).toEqual('Macintosh')
  })

  it('should return "Model inconnu" when no device model is found', () => {
    jest
      .spyOn(global.navigator, 'userAgent', 'get')
      .mockReturnValueOnce(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      )

    const { result } = renderHook(getDeviceModelFromUserAgent)

    expect(result.current).toBe('Model inconnu')
  })
})
