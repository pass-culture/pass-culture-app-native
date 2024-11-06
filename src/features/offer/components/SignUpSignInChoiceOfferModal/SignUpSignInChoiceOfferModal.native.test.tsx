import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { SignUpSignInChoiceOfferModal } from './SignUpSignInChoiceOfferModal'

const OFFER_ID = 123
const dismissModal = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('SignUpSignInChoiceOfferModal', () => {
  it('should match previous snapshot', () => {
    render(<SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)

    expect(screen).toMatchSnapshot()
  })

  it('should go to login with offerId in params on button click and log analytics', async () => {
    render(<SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)

    const button = screen.getByText('Se connecter')
    await fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.OFFER,
      offerId: OFFER_ID,
    })
    expect(analytics.logSignInFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
  })

  it('should go to signup with offerId in params on click button and log analytics', async () => {
    render(<SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)

    const button = screen.getByText('Créer un compte')
    await fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.OFFER,
      offerId: OFFER_ID,
    })
    expect(analytics.logSignUpFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
      from: 'offer_favorite',
    })
  })

  it('should log analytics when quitting modal', async () => {
    render(<SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />)

    const closeButton = screen.getByTestId('Fermer la modale')
    await fireEvent.press(closeButton)

    expect(dismissModal).toHaveBeenCalledTimes(1)
    expect(analytics.logQuitFavoriteModalForSignIn).toHaveBeenNthCalledWith(1, OFFER_ID)
  })
})
