import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
// eslint-disable-next-line no-restricted-imports
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('SelectIDOrigin', () => {
  it('should render correctly', () => {
    render(<SelectIDOrigin />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press french HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const HeroButtonListFrench = screen.getByTestId(
      'J’ai une carte d’identité ou un passeport français'
    )
    await user.press(HeroButtonListFrench)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'SelectIDStatus',
    })
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const ButtonForeign = screen.getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    await user.press(ButtonForeign)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      screen: 'DMSIntroduction',
      params: {
        isForeignDMSInformation: true,
      },
    })
  })
})
