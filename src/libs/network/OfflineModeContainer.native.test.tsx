import React from 'react'
import { View, Text } from 'react-native'

import { NetInfoStateType } from '__mocks__/@react-native-community/netinfo'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { render, screen } from 'tests/utils'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OfflineModeContainer />', () => {
  mockUseNetInfoContext.mockReturnValue({
    isConnected: false,
    isInternetReachable: false,
    type: NetInfoStateType.none,
    details: null,
  })

  it('should render children and show banner when offline at init when isConnected is false', () => {
    renderOfflineModeContainer()

    expect(screen.getByText('Hello World')).toBeOnTheScreen()
    expect(screen.getByText('aucune connexion internet.')).toBeOnTheScreen()
  })

  it('should render children and not show banner when offline at init when isConnected is true', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderOfflineModeContainer()

    expect(screen.queryByText('aucune connexion internet.')).not.toBeOnTheScreen()
    expect(screen.getByText('Hello World')).toBeOnTheScreen()
  })

  it('should not show "aucune connexion internet." at init, then show when isConnected is false, then hide when isConnected switch back to true', () => {
    mockUseNetInfoContext.mockReturnValueOnce({
      isConnected: true,
      isInternetReachable: true,
    })
    renderOfflineModeContainer()

    expect(screen.queryByText('aucune connexion internet.')).not.toBeOnTheScreen()

    mockUseNetInfoContext.mockImplementationOnce(() => ({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    }))
    screen.rerender(getJsx())

    expect(screen.getByText('aucune connexion internet.')).toBeOnTheScreen()
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
