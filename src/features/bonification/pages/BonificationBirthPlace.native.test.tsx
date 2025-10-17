import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBirthPlace', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationBirthPlace />)

    await completeFormAndContinue()

    expect(navigate).toHaveBeenCalledWith('BonificationRecap')
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationBirthPlace />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  describe('Data persistence', () => {
    beforeEach(() => {
      const { resetLegalRepresentative } = legalRepresentativeActions
      resetLegalRepresentative()
    })

    it('should show previously saved data if there is any', () => {
      const { setBirthCountry, setBirthCity } = legalRepresentativeActions
      const birthCountry = 'France'
      const birthCity = 'Toulouse'
      setBirthCountry(birthCountry)
      setBirthCity(birthCity)

      render(<BonificationBirthPlace />)

      const countryField = screen.getByDisplayValue(birthCountry)
      const cityField = screen.getByDisplayValue(birthCity)

      expect(countryField.props.value).toBe(birthCountry)
      expect(cityField.props.value).toBe(birthCity)
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setBirthCountrySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCountry')
      const setBirthCitySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCity')

      render(<BonificationBirthPlace />)

      await completeFormAndContinue()

      expect(setBirthCountrySpy).toHaveBeenCalledWith('France')
      expect(setBirthCitySpy).toHaveBeenCalledWith('Toulouse')
    })
  })
})

async function completeFormAndContinue() {
  // Fill the country input
  const countryOfBirthField = screen.getByTestId('Entrée pour le pays de naissance')
  await userEvent.type(countryOfBirthField, 'France')

  // Select the suggested country
  const countrySuggestion = screen.getByText('France')
  await userEvent.press(countrySuggestion)

  // Fill in the city input
  const cityOfBirthField = screen.getByTestId('Entrée pour la ville de naissance')
  await userEvent.type(cityOfBirthField, 'Toulouse')

  // Attempt to go validate the form
  const button = screen.getByText('Continuer')
  await userEvent.press(button)
}
