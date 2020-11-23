import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { ChoosePassword } from 'features/auth/pages/ChoosePassword'
import { ColorsEnum } from 'ui/theme'

describe('ChoosePassword Page', () => {
  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChoosePassword />)

    const continueButton = getByTestId('button-container')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.PRIMARY_DISABLED)

    const passwordInput = getByPlaceholderText('Ton mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  // TODO: PC-4910 password submission should redirect to birth date form
  // TODO: PC-4913 arrow previous click should redirect to email form
  // TODO: PC-5430 gestion du storage de l'email & password
  // TODO: PC-4936 right icon click = abandon registration
})
