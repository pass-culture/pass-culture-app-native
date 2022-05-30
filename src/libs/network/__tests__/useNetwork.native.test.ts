import { useNetInfo } from '@react-native-community/netinfo'

import { useNetwork } from 'libs/network/useNetwork'

jest.mock('@react-native-community/netinfo')
const mockUseNetInfo = useNetInfo as jest.Mock

describe('useNetwork', () => {
  it('should return is connected when native lib says so', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true })
    const { isConnected } = useNetwork()

    expect(isConnected).toEqual(true)
  })

  it('should return is not connected when native lib says so', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false })
    const { isConnected } = useNetwork()

    expect(isConnected).toEqual(false)
  })

  it('should return is not connected when native lib is broken (returns empty object)', () => {
    mockUseNetInfo.mockReturnValueOnce({})
    const { isConnected } = useNetwork()

    expect(isConnected).toEqual(false)
  })
})
