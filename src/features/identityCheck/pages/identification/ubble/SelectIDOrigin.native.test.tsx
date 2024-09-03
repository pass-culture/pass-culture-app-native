import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
// eslint-disable-next-line no-restricted-imports
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

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
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined))
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const ButtonForeign = screen.getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('DMSIntroduction', {
        isForeignDMSInformation: true,
      })
    )
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<SelectIDOrigin />)

    await waitFor(() => expect(analytics.logScreenViewSelectIdOrigin).toHaveBeenCalledTimes(1))
  })

  it('should log analytics with french type on press french HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const HeroButtonListFrench = screen.getByTestId(
      'J’ai une carte d’identité ou un passeport français'
    )
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() =>
      expect(analytics.logSetIdOriginClicked).toHaveBeenNthCalledWith(1, 'France')
    )
  })

  it('should log analytics with foregin type on press foreign HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const ButtonForeign = screen.getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      expect(analytics.logSetIdOriginClicked).toHaveBeenNthCalledWith(1, 'Foreign')
    )
  })
})
