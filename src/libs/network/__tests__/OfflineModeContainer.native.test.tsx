import React from 'react'
import { View, Text } from 'react-native'

import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { render, screen } from 'tests/utils'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('<OfflineModeContainer />', () => {
  mockUseNetInfoContext.mockImplementation(() => ({ isConnected: false }))

  it('should render children and show banner when offline at init when isConnected is false', () => {
    renderOfflineModeContainer()
    expect(screen.queryByText('Hello World')).toBeOnTheScreen()
    expect(screen.queryByText('aucune connexion internet.')).toBeOnTheScreen()
  })

  it('should render children and not show banner when offline at init when isConnected is true', () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    renderOfflineModeContainer()
    expect(screen.queryByText('aucune connexion internet.')).not.toBeOnTheScreen()
    expect(screen.queryByText('Hello World')).toBeOnTheScreen()
  })

  it('should not show "aucune connexion internet." at init, then show when isConnected is false, then hide when isConnected switch back to true', () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({
      isConnected: true,
      isInternetReachable: true,
    }))
    renderOfflineModeContainer()
    expect(screen.queryByText('aucune connexion internet.')).not.toBeOnTheScreen()

    mockUseNetInfoContext.mockImplementationOnce(() => ({
      isConnected: false,
      isInternetReachable: false,
    }))
    screen.rerender(getJsx())

    expect(screen.queryByText('aucune connexion internet.')).toBeOnTheScreen()
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
