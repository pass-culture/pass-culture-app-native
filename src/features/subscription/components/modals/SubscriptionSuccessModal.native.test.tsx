import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionTheme, SUSBCRIPTION_THEMES } from 'features/subscription/types'
import { render, screen, userEvent } from 'tests/utils'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<SubscriptionSuccessModal />', () => {
  it.each(SUSBCRIPTION_THEMES)('should render correctly for %s', (theme) => {
    render(<SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when user presses "Continuer sur l’app"', async () => {
    const dismissModal = jest.fn()
    render(
      <SubscriptionSuccessModal
        visible
        theme={SubscriptionTheme.CINEMA}
        dismissModal={dismissModal}
      />
    )

    await user.press(screen.getByText('Continuer sur l’app'))

    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it('should navigate to notifications settings when user presses "Voir mes paramètres"', async () => {
    render(
      <SubscriptionSuccessModal visible theme={SubscriptionTheme.CINEMA} dismissModal={jest.fn()} />
    )

    await user.press(screen.getByText('Voir mes préférences'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'NotificationsSettings',
    })
  })

  it('should dismiss modal when navigating to notifications settings', async () => {
    const dismissModal = jest.fn()
    render(
      <SubscriptionSuccessModal
        visible
        theme={SubscriptionTheme.CINEMA}
        dismissModal={dismissModal}
      />
    )

    await user.press(screen.getByText('Voir mes préférences'))

    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
