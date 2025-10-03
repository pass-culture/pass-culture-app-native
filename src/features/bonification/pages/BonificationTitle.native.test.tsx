import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationTitle } from 'features/bonification/pages/BonificationTitle'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationTitle', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationTitle />)

    const titleField = screen.getByTestId('Civilité - Monsieur - non sélectionné')
    await userEvent.press(titleField)

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationBirthDate')
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationTitle />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
