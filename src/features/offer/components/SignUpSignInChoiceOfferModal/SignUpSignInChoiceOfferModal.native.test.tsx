import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { cleanup, fireEvent, render } from 'tests/utils'

import { SignUpSignInChoiceOfferModal } from './SignUpSignInChoiceOfferModal'

const OFFER_ID = 123
const dismissModal = jest.fn()

describe('SignUpSignInChoiceOfferModal', () => {
  afterEach(cleanup)

  it('should match previous snapshot', () => {
    const modal = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )
    expect(modal).toMatchSnapshot()
  })

  it('go to login with offerId in params on button click and log analytics', async () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const button = getByText('Se connecter')
    await fireEvent.press(button)

    expect(navigate).toBeCalledWith('Login', { preventCancellation: true, offerId: OFFER_ID })
    expect(analytics.logSignInFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
  })

  it('go to signup with offerId in params on click button and log analytics', async () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const button = getByText('Créer un compte')
    await fireEvent.press(button)

    expect(navigate).toBeCalledWith('SignupForm', { preventCancellation: true, offerId: OFFER_ID })
    expect(analytics.logSignUpFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
  })

  it('should log analytics when quitting modal', async () => {
    const { getByTestId } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const closeButton = getByTestId('Fermer la modale')
    await fireEvent.press(closeButton)

    expect(dismissModal).toHaveBeenCalledTimes(1)
    expect(analytics.logQuitFavoriteModalForSignIn).toHaveBeenNthCalledWith(1, OFFER_ID)
  })
})
