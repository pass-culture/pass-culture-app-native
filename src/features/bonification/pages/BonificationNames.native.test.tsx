import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationNames', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationNames />)

    const firstNameField = screen.getByTestId('Entrée pour le prénom')
    await userEvent.type(firstNameField, 'Jaques')
    const birthNameField = screen.getByTestId('Entrée pour le nom')
    await userEvent.type(birthNameField, 'Dupont')

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationTitle')
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationNames />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
