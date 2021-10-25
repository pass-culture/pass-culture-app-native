import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { ChangeEmail } from '../ChangeEmail'

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should enable the submit button when passwords length is more or equal than 12', async () => {
    const { getByPlaceholderText, getByTestId } = await render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const background = submitButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    await waitForExpect(() => {
      const background = submitButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })
})
