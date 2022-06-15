// eslint-disable-next-line no-restricted-imports
import { useNetInfo as useNetInfoDefault } from '@react-native-community/netinfo'
import React from 'react'
import { View, Text } from 'react-native'

import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { render } from 'tests/utils'

jest.mock('@react-native-community/netinfo')
const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('<OfflineModeContainer />', () => {
  it('should render children and not show banner when online', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false })
    const renderAPI = renderOfflineModeContainer()
    expect(renderAPI.queryByText('aucune connexion internet.')).toBeTruthy()
    expect(renderAPI.queryByText('Hello World')).toBeTruthy()
  })
  it('should render children and show banner when offline', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true })
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
