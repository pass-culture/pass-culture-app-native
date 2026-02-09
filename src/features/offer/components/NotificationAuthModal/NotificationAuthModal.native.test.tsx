import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { NotificationAuthModal } from 'features/offer/components/NotificationAuthModal/NotificationAuthModal'
import { analytics } from 'libs/analytics/provider'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

const OFFER_ID = 123
const dismissModal = jest.fn()

const user = userEvent.setup()

describe('NotificationAuthModal', () => {
  it('should match previous snapshot', () => {
    renderNotificationAuthModal()

    expect(screen).toMatchSnapshot()
  })

  describe('sign in', () => {
    it('should navigate to login page', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('Login', {
        from: StepperOrigin.NOTIFICATION,
        offerId: OFFER_ID,
      })
    })

    it('should send `logSignInFromOffer` event', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(analytics.logSignInFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })

  describe('sign up', () => {
    it('should navigate to sign up page', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        from: StepperOrigin.NOTIFICATION,
        offerId: OFFER_ID,
      })
    })

    it('should send `logSignUpFromOffer` and `logSignUpClicked` events', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(analytics.logSignUpFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
        from: 'offer_notification',
      })
    })
  })
})

const renderNotificationAuthModal = () =>
  render(<NotificationAuthModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)
