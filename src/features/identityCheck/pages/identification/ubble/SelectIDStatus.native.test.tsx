import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationSessionResponse } from 'api/gen'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('SelectIDStatus', () => {
  it('should render SelectIDStatus page correctly', () => {
    render(reactQueryProviderHOC(<SelectIDStatus />))

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to ubble webview when pressing "J’ai ma pièce d’identité en cours de validité" button', async () => {
    const response: IdentificationSessionResponse = {
      identificationUrl: 'https://id.ubble.ai/000',
    }
    mockServer.postApi('/v1/ubble_identification', response)

    render(reactQueryProviderHOC(<SelectIDStatus />))

    const button = screen.getByText('J’ai ma pièce d’identité en cours de validité')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: { identificationUrl: response.identificationUrl },
      screen: 'UbbleWebview',
    })
  })

  it('should navigate to ComeBackLater when pressing "Je n’ai pas ma pièce d’identité originale" button', async () => {
    render(reactQueryProviderHOC(<SelectIDStatus />))

    const button = screen.getByText('Je n’ai pas ma pièce d’identité originale avec moi')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'ComeBackLater',
    })
  })

  it("should navigate to ExpiredOrLostID when pressing 'Ma pièce d'identité est expirée ou perdue' button", async () => {
    render(reactQueryProviderHOC(<SelectIDStatus />))

    const button = screen.getByText('Ma pièce d’identité est expirée ou perdue')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'ExpiredOrLostID',
    })
  })
})
