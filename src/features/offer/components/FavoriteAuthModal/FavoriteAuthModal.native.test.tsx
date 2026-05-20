import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { FavoriteAuthModal } from './FavoriteAuthModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

const OFFER_ID = 123
const dismissModal = jest.fn()

const user = userEvent.setup()

describe('FavoriteAuthModal', () => {
  it('should match previous snapshot', () => {
    renderFavoriteAuthModal()

    expect(screen).toMatchSnapshot()
  })

  describe('sign in', () => {
    it('should navigate to sign in page with offerId in params', async () => {
      renderFavoriteAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('Login', {
        from: StepperOrigin.FAVORITE,
        offerId: OFFER_ID,
      })
    })

    it('should send `logSignInFromOffer` event', async () => {
      renderFavoriteAuthModal()

      const button = screen.getByText('Se connecter')
      await user.press(button)

      expect(analytics.logSignInFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })

  describe('sign up', () => {
    it('should navigate to signup page with offerId in params', async () => {
      renderFavoriteAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        from: StepperOrigin.FAVORITE,
        offerId: OFFER_ID,
      })
    })

    it('should send `logSignUpFromOffer` and `logSignUpClicked` events', async () => {
      renderFavoriteAuthModal()

      const button = screen.getByText('Créer un compte')
      await user.press(button)

      expect(analytics.logSignUpFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
        from: 'offer_favorite',
      })
    })
  })

  it('should send `logQuitFavoriteModalForSignIn` when closing modal', async () => {
    renderFavoriteAuthModal()

    const closeButton = screen.getByTestId('Fermer la modale')
    await user.press(closeButton)

    expect(dismissModal).toHaveBeenCalledTimes(1)
    expect(analytics.logQuitFavoriteModalForSignIn).toHaveBeenNthCalledWith(1, OFFER_ID)
  })
})

const renderFavoriteAuthModal = () =>
  render(<FavoriteAuthModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)
