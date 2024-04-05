import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionTheme } from 'features/subscription/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

describe('<SubscriptionSuccessModal />', () => {
  it.each(Object.values(SubscriptionTheme))('should render correctly for %s', (theme) => {
    render(<SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when user press "Continuer sur l’app"', () => {
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

  it('should navigate to notifications settings when user press "Voir mes paramètres"', async () => {
    render(
      <SubscriptionSuccessModal visible theme={SubscriptionTheme.CINEMA} dismissModal={jest.fn()} />
    )

    fireEvent.press(screen.getByText('Voir mes préférences'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('NotificationsSettingsWIP', undefined)
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
