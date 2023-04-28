import { getDeviceModelFromUserAgent } from 'features/profile/helpers/TrustedDevices/getDeviceModelFromUserAgent'
import { renderHook } from 'tests/utils'

describe('getDeviceModelFromUserAgent', () => {
  it('should return "Model inconnu" on native', () => {
    const { result } = renderHook(() => getDeviceModelFromUserAgent())

    expect(result.current).toEqual('Model inconnu')
  })
})
