import React from 'react'
import { View, Text } from 'react-native'

import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { render } from 'tests/utils'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('<OfflineModeContainer />', () => {
  mockUseNetInfoContext.mockImplementation(() => ({ isConnected: false }))

  it('should render children and show banner when offline at init when isConnected is false', () => {
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
  })

  it('should render children and not show banner when offline at init when isConnected is true', () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeFalsy()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
  })

  it('should not show "aucune connexion internet." at init, then show when isConnected is false, then hide when isConnected switch back to true', () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({
      isConnected: true,
      isInternetReachable: true,
    }))
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeFalsy()

    mockUseNetInfoContext.mockImplementationOnce(() => ({
      isConnected: false,
      isInternetReachable: false,
    }))
    renderAPI.rerender(getJsx())

    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
  })
})

// for rerender, it cannot be static, it has to be new
const getJsx = () => (
  <OfflineModeContainer>
    <View>
      <Text>Hello World</Text>
    </View>
  </OfflineModeContainer>
)

function renderOfflineModeContainer() {
  return render(getJsx())
}
