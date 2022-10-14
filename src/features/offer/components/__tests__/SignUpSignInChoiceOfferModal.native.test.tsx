import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { cleanup, fireEvent, render } from 'tests/utils'

import { SignUpSignInChoiceOfferModal } from '../SignUpSignInChoiceOfferModal'

const OFFER_ID = 123
describe('SignUpSignInChoiceOfferModal', () => {
  const dismissModal = jest.fn()

  afterEach(cleanup)

  it('renders the modal', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )
    expect(getByText('Connecte-toi pour profiter de cette fonctionnalité')).toBeTruthy()
  })

  it('go to login on click button and log analytics', async () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const button = getByText('Se connecter')
    await fireEvent.press(button)

    expect(navigate).toBeCalledWith('Login', undefined)
    expect(analytics.logSignInFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
  })

  it('go to signup on click button and log analytics', async () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const button = getByText(`S’inscrire`)
    await fireEvent.press(button)

    expect(navigate).toBeCalledWith('SignupForm', undefined)
    expect(analytics.logSignUpFromOffer).toHaveBeenNthCalledWith(1, OFFER_ID)
  })

  it('should log analytics when quitting modal', async () => {
    const { getByTestId } = render(
      <SignUpSignInChoiceOfferModal offerId={OFFER_ID} visible dismissModal={dismissModal} />
    )

    const closeButton = getByTestId('rightIcon')
    await fireEvent.press(closeButton)

    expect(dismissModal).toBeCalled()
    expect(analytics.logQuitFavoriteModalForSignIn).toHaveBeenNthCalledWith(1, OFFER_ID)
  })
})
