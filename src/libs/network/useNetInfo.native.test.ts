// eslint-disable-next-line no-restricted-imports
import { useNetInfo as useNetInfoDefault } from '@react-native-community/netinfo'

import { useNetInfo } from 'libs/network/useNetInfo'

jest.mock('@react-native-community/netinfo')
const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('useNetInfo', () => {
  it('should return is connected when native lib says so', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
    const { isConnected, isInternetReachable } = useNetInfo()

    expect(isConnected).toEqual(true)
    expect(isInternetReachable).toEqual(true)
  })

  it('should return is not connected when native lib says so', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    const { isConnected, isInternetReachable } = useNetInfo()

    expect(isConnected).toEqual(false)
    expect(isInternetReachable).toEqual(false)
  })
})
