import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionTheme, SUSBCRIPTION_THEMES } from 'features/subscription/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SubscriptionSuccessModal />', () => {
  it.each(SUSBCRIPTION_THEMES)('should render correctly for %s', (theme) => {
    render(<SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when user presses "Continuer sur l’app"', () => {
    const dismissModal = jest.fn()
    render(
      <SubscriptionSuccessModal
        visible
        theme={SubscriptionTheme.CINEMA}
        dismissModal={dismissModal}
      />
    )

    fireEvent.press(screen.getByText('Continuer sur l’app'))

    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it('should navigate to notifications settings when user presses "Voir mes paramètres"', async () => {
    render(
      <SubscriptionSuccessModal visible theme={SubscriptionTheme.CINEMA} dismissModal={jest.fn()} />
    )

    fireEvent.press(screen.getByText('Voir mes préférences'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('NotificationsSettings', undefined)
    })
  })

  it('should dismiss modal when navigating to notifications settings', () => {
    const dismissModal = jest.fn()
    render(
      <SubscriptionSuccessModal
        visible
        theme={SubscriptionTheme.CINEMA}
        dismissModal={dismissModal}
      />
    )

    fireEvent.press(screen.getByText('Voir mes préférences'))

    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
