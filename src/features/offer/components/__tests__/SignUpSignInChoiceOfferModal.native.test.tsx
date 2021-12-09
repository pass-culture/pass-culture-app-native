import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { cleanup, fireEvent, render } from 'tests/utils'

import { SignUpSignInChoiceOfferModal } from '../SignUpSignInChoiceOfferModal'

describe('SignUpSignInChoiceOfferModal', () => {
  const dismissModal = jest.fn()

  afterEach(cleanup)

  it('renders the modal', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} />
    )
    expect(getByText('Connecte-toi pour profiter de cette fonctionnalité')).toBeTruthy()
  })

  it('go to login on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} />
    )

    const button = getByText('Se connecter')
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('Login')
  })

  it('go to signup on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} />
    )

    const button = getByText(`S'inscrire`)
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('SignupForm')
  })
})
