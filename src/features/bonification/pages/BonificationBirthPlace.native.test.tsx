import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { InseeCountry } from 'features/bonification/inseeCountries'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { SuggestedCity } from 'libs/place/types'
import { CITIES_API_URL, CitiesResponse } from 'libs/place/useCities'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const birthCountry: InseeCountry = { LIBCOG: 'France', COG: 99100 }
const birthCity: SuggestedCity = {
  name: 'Paris',
  code: '75056',
  postalCode: '75017',
}

describe('BonificationBirthPlace', () => {
  beforeEach(() => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, [
      {
        nom: 'Paris',
        code: '75056',
        codeDepartement: '75',
        codeRegion: '',
        codesPostaux: ['75017'],
        population: 150000,
      },
    ])
  })

  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    renderBonificationBirthPlace()

    await completeForm()
    await goToNextScreen()

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationRecap',
    })
  })

  it('Should go back when pressing go back button', async () => {
    renderBonificationBirthPlace()

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

      renderBonificationBirthPlace()

      const countryField = screen.getByDisplayValue(birthCountry.LIBCOG)
      const cityField = screen.getByDisplayValue(birthCity.postalCode)

      expect(countryField.props.value).toBe(birthCountry.LIBCOG)
      expect(cityField.props.value).toBe(birthCity.postalCode)
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setBirthCountrySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCountry')
      const setBirthCitySpy = jest.spyOn(legalRepresentativeActions, 'setBirthCity')

      renderBonificationBirthPlace()

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
  const cityOfBirthField = screen.getByTestId('Entrée pour la ville')
  await userEvent.type(cityOfBirthField, birthCity.postalCode)

  // Select the suggested city
  const citySuggestion = screen.getByText(birthCity.name)
  await userEvent.press(citySuggestion)
}

async function goToNextScreen() {
  // Attempt to go validate the form
  const button = screen.getByText('Continuer')
  await userEvent.press(button)
}

function renderBonificationBirthPlace() {
  return render(reactQueryProviderHOC(<BonificationBirthPlace />)) // We use react-query on city search
}
