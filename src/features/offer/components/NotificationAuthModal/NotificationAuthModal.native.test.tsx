import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { NotificationAuthModal } from 'features/offer/components/NotificationAuthModal/NotificationAuthModal'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
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
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should match previous snapshot', () => {
    renderNotificationAuthModal()

    expect(screen).toMatchSnapshot()
  })

  describe('sign in', () => {
    it('should navigate to LoginMethods page', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('LoginMethods', {
        from: StepperOrigin.NOTIFICATION,
        offerId: OFFER_ID,
      })
    })

    it('should send `logLoginClicked` event', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, {
        from: 'offer_notification',
        offerId: OFFER_ID,
        itemType: 'offer',
      })
    })
  })

  describe('sign up', () => {
    it('should navigate to sign up page', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('SignupMethods', {
        from: StepperOrigin.NOTIFICATION,
        offerId: OFFER_ID,
      })
    })

    it('should send `logSignUpClicked` events', async () => {
      renderNotificationAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
        from: 'offer_notification',
        offerId: OFFER_ID,
        itemType: 'offer',
      })
    })
  })
})

const renderNotificationAuthModal = () =>
  render(<NotificationAuthModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)
