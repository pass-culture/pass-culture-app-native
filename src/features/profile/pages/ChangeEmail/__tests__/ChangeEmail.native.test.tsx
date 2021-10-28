import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { ChangeEmail } from '../ChangeEmail'

jest.mock('react-query')

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it.each`
    password          | email                | backgroundColor          | isDisabled
    ${'password>=12'} | ${'valid@email.com'} | ${ColorsEnum.PRIMARY}    | ${false}
    ${'password>=12'} | ${'invalid@email'}   | ${ColorsEnum.GREY_LIGHT} | ${true}
    ${'password<12'}  | ${'valid@email.com'} | ${ColorsEnum.GREY_LIGHT} | ${true}
  `(
    'CTA "Enregistrer" (disabled=$isDisabled) with background color = $backgroundColor if password = "$password" and email = $email',
    async ({ password, email, backgroundColor }) => {
      const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
      const submitButton = getByTestId('Enregistrer')
      const background = submitButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.GREY_LIGHT)

      const passwordInput = getByPlaceholderText('Ton mot de passe')
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(passwordInput, password)
      fireEvent.changeText(emailInput, email)

      await waitForExpect(() => {
        const background = submitButton.props.style.backgroundColor
        expect(background).toEqual(backgroundColor)
      })
    }
  )

  it('should navigate to Profile if the API call is ok', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, '1234567890123')
    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })
})
