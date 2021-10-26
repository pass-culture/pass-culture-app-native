import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { ChangeEmail } from '../ChangeEmail'

jest.mock('react-query')

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should enable the submit button when password length >= 12 and is valid e-mail ', async () => {
    const { getByPlaceholderText, getByTestId } = await render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const background = submitButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(emailInput, 'johndoe@gmail.com')
    await waitForExpect(() => {
      const background = submitButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })
})
