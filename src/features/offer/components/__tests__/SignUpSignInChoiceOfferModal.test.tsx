import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { SignUpSignInChoiceOfferModal } from '../SignUpSignInChoiceOfferModal'

describe('SignUpSignInChoiceOfferModal', () => {
  const dismissModal = jest.fn()
  const id = 1337
  beforeEach(() => {
    jest.clearAllMocks()
    useRoute.mockImplementation(() => ({
      params: {
        id,
      },
    }))
  })

  it('renders the modal', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} id={id} />
    )
    expect(getByText('Connecte-toi pour profiter de cette fonctionnalité')).toBeTruthy()
  })

  it('go to login on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} id={id} />
    )

    const button = getByText('Se connecter')
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('Login', {
      backNavigation: {
        from: 'Offer',
        params: {
          id: 1337,
          shouldDisplayLoginModal: true,
        },
      },
    })
  })

  it('go to signup on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceOfferModal visible={true} dismissModal={dismissModal} id={id} />
    )

    const button = getByText(`S'inscrire`)
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('SetEmail', {
      backNavigation: {
        from: 'Offer',
        params: {
          id: 1337,
          shouldDisplayLoginModal: true,
        },
      },
    })
  })
})
