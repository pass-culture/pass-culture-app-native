import React from 'react'
import { View, Text } from 'react-native'

import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { useNetInfo as useNetInfoDefault } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('<OfflineModeContainer />', () => {
  mockUseNetInfo.mockImplementation(() => ({ isConnected: false }))

  it('should render children and show banner when offline at init when isConnected is false', () => {
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
  })

  it('should render children and not show banner when offline at init when isConnected is true', () => {
    mockUseNetInfo.mockImplementationOnce(() => ({ isConnected: true }))
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeFalsy()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
  })

  it('should not show "aucune connexion internet." at init, then show when isConnected is false, then hide when isConnected switch back to true', () => {
    mockUseNetInfo.mockImplementationOnce(() => ({ isConnected: true, isInternetReachable: true }))
    const renderAPI = render(jsx)
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeFalsy()

    mockUseNetInfo.mockImplementationOnce(() => ({
      isConnected: false,
      isInternetReachable: false,
    }))
    renderAPI.rerender(
      <OfflineModeContainer>
        <View>
          <Text>Hello World</Text>
        </View>
      </OfflineModeContainer>
    )

    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
  })
})

const jsx = (
  <OfflineModeContainer>
    <View>
      <Text>Hello World</Text>
    </View>
  </OfflineModeContainer>
)

function renderOfflineModeContainer() {
  return render(
    <OfflineModeContainer>
      <View>
        <Text>Hello World</Text>
      </View>
    </OfflineModeContainer>
  )
}
