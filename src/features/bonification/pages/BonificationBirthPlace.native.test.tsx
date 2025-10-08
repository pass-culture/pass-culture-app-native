import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBirthPlace', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationBirthPlace />)

    const countryOfBirthField = screen.getByTestId('Entrée pour le pays de naissance')
    await userEvent.type(countryOfBirthField, 'France')
    const cityOfBirthField = screen.getByTestId('Entrée pour la ville de naissance')
    await userEvent.type(cityOfBirthField, 'Toulouse')

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationRecap')
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationBirthPlace />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
