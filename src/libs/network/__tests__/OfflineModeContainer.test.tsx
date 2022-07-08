import React from 'react'
import { View, Text } from 'react-native'

import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { useNetInfo as useNetInfoDefault } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('<OfflineModeContainer />', () => {
  mockUseNetInfo.mockImplementation(() => ({ isConnected: false }))

  it('should render children and show banner when offline', () => {
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
  })
  it('should render children and not show banner when offline', () => {
    mockUseNetInfo.mockImplementationOnce(() => ({ isConnected: true }))
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeFalsy()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
  })
})

function renderOfflineModeContainer() {
  return render(
    <OfflineModeContainer>
      <View>
        <Text>Hello World</Text>
      </View>
    </OfflineModeContainer>
  )
}
