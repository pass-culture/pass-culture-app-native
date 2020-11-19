import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useRoute } from '__mocks__/@react-navigation/native'
import { ColorsEnum } from 'ui/theme'

import { ReinitializePassword } from './ReinitializePassword'

jest.mock('features/home/navigation/HomeNavigator')

describe('ReinitializePassword Page', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expiration_date: 45465546445,
      },
    }))
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should enable the submit button when passwords are equals and filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ReinitializePassword />)

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456')

    // assuming there's only one button in this page
    const continueButton = getByTestId('button-container')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ReinitializePassword />)

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    // assuming there's only one button in this page
    const notMatchingErrorText = getByTestId('not-matching-error')

    await waitFor(async () => {
      const color = notMatchingErrorText.props.style[0].color
      expect(color).toEqual(ColorsEnum.ERROR)
    })
  })

  it('should validate PasswordSecurityRules when password is correct', async () => {
    const { toJSON, getByPlaceholderText } = render(<ReinitializePassword />)

    const notValidatedRulesSnapshot = toJSON()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')

    await waitForExpect(() => {
      const validatedRulesSnapshot = toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })
})
