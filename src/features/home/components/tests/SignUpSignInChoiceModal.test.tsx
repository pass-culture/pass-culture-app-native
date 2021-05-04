import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SignUpSignInChoiceModal } from 'features/home/components'
import { fireEvent, render } from 'tests/utils'

let mockDepositAmount = '300 €'
jest.mock('features/auth/api', () => ({ useDepositAmount: () => mockDepositAmount }))

describe('SignUpSignInChoiceModal', () => {
  const dismissModal = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  })

  it('should display correct depositAmount when is 300', () => {
    mockDepositAmount = '300 €'
    const { queryByText } = render(
      <SignUpSignInChoiceModal visible={true} dismissModal={dismissModal} />
    )

    expect(
      queryByText(
        /Si tu as 18 ans, tu es éligible pour obtenir une aide financière de 300 € proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture./
      )
    ).toBeTruthy()
  })

  it('should display correct depositAmount when is 300', () => {
    mockDepositAmount = '500 €'
    const { queryByText } = render(
      <SignUpSignInChoiceModal visible={true} dismissModal={dismissModal} />
    )

    expect(
      queryByText(
        /Si tu as 18 ans, tu es éligible pour obtenir une aide financière de 500 € proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture./
      )
    ).toBeTruthy()
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
