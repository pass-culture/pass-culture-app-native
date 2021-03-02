import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SignUpSignInChoiceModal } from 'features/home/components'

describe('SignUpSignInChoiceModal', () => {
  const dismissModal = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  })

  it('renders the modal', () => {
    const { getByText } = render(
      <SignUpSignInChoiceModal visible={true} dismissModal={dismissModal} />
    )
    expect(getByText('Le pass Culture est accessible à tous !')).toBeTruthy()
  })

  it('go to login on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceModal visible={true} dismissModal={dismissModal} />
    )

    const button = getByText('Se connecter')
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('Login', {
      backNavigation: {
        from: 'Home',
        params: {
          shouldDisplayLoginModal: true,
        },
      },
    })
  })

  it('go to signup on click button', () => {
    const { getByText } = render(
      <SignUpSignInChoiceModal visible={true} dismissModal={dismissModal} />
    )

    const button = getByText(`S'inscrire`)
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('SetEmail', {
      backNavigation: {
        from: 'Home',
        params: {
          shouldDisplayLoginModal: true,
        },
      },
    })
  })
})
