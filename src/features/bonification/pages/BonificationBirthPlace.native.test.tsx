import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { InseeCountry } from 'features/bonification/inseeCountries'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const birthCountry: InseeCountry = { LIBCOG: 'France', COG: 99100 }
const birthCity = 'Toulouse'

describe('BonificationBirthPlace', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationBirthPlace />)

    await completeForm()
    await goToNextScreen()

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
      setBirthCountry(birthCountry)
      setBirthCity(birthCity)

      render(<BonificationBirthPlace />)

      const countryField = screen.getByDisplayValue(birthCountry.LIBCOG)
      const cityField = screen.getByDisplayValue(birthCity)

      expect(countryField.props.value).toBe(birthCountry.LIBCOG)
      expect(cityField.props.value).toBe(birthCity)
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setBirthCountrySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCountry')
      const setBirthCitySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCity')

      render(<BonificationBirthPlace />)

      await completeForm()
      await goToNextScreen()

      expect(setBirthCountrySpy).toHaveBeenCalledWith(birthCountry)
      expect(setBirthCitySpy).toHaveBeenCalledWith(birthCity)
    })
  })
})

async function completeForm() {
  // Fill the country input
  const countryOfBirthField = screen.getByTestId('Entrée pour le pays de naissance')
  await userEvent.type(countryOfBirthField, 'fra')

  // Select the suggested country
  const countrySuggestion = screen.getByText(birthCountry.LIBCOG)
  await userEvent.press(countrySuggestion)

  // Fill in the city input
  const cityOfBirthField = screen.getByTestId('Entrée pour la ville de naissance')
  await userEvent.type(cityOfBirthField, birthCity)
}

async function goToNextScreen() {
  // Attempt to go validate the form
  const button = screen.getByText('Continuer')
  await userEvent.press(button)
}
