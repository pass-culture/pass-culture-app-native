import React from 'react'

import { goBack, navigate, useRoute } from '__mocks__/@react-navigation/native'
import { InseeCountries, InseeCountry } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { CITIES_API_URL } from 'libs/place/queries/constants'
import { CitiesResponse, SuggestedCity } from 'libs/place/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('libs/jwt/jwt')

const birthCountry: InseeCountry = { libcog: 'France', cog: 99100 }
const birthCity: SuggestedCity = {
  name: 'Paris',
  code: '75056',
  postalCode: '75017',
  departementCode: '75',
}

const inseeCountriesMock: InseeCountries = {
  countries: [
    {
      cog: 99100,
      libcog: 'France',
    },
    {
      cog: 99101,
      libcog: 'Danemark',
    },
  ],
}

describe('BonificationBirthPlace', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
    mockServer.getApi<InseeCountries>(`/v1/countries`, inseeCountriesMock)
  })

  describe('Family quotient bonification', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.FAMILY_QUOTIENT } })
    })

    it('should display legal representative wording and step 4/5', () => {
      renderBonificationBirthPlace()

      expect(screen.getByText('Étape 4 sur 5')).toBeTruthy()
      expect(
        screen.getByText('Quel est le lieu de naissance de ton représentant légal ?')
      ).toBeTruthy()
    })

    it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
      renderBonificationBirthPlace()

      await completeForm()
      await goToNextScreen()

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
        screen: 'BonificationRecap',
      })
    })

    it('should navigate to FAQ if button pressed', async () => {
      renderBonificationBirthPlace()

      const button = screen.getByText('Je ne connais pas son lieu de naissance')
      await userEvent.press(button)

      expect(openUrl).toHaveBeenNthCalledWith(
        1,
        env.FAQ_BONIFICATION_LEGAL_GUARDIAN_BIRTH_INFORMATIONS
      )
    })
  })

  describe('Disability bonification', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.DISABILITY } })
    })

    it('should display disability wording and step 1/2', () => {
      renderBonificationBirthPlace()

      expect(screen.getByText('Étape 1 sur 2')).toBeTruthy()
      expect(screen.getByText('Quel est ton lieu de naissance ?')).toBeTruthy()
    })

    it('should not display FAQ button', () => {
      renderBonificationBirthPlace()

      expect(screen.queryByText('Je ne connais pas son lieu de naissance')).toBeNull()
    })

    it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
      renderBonificationBirthPlace()

      await completeForm()
      await goToNextScreen()

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationRecap',
      })
    })
  })

  it('should go back when pressing go back button', async () => {
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

      const countryField = screen.getByDisplayValue(birthCountry.libcog)
      const cityField = screen.getByDisplayValue(birthCity.name)

      expect(countryField.props.value).toBe(birthCountry.libcog)
      expect(cityField.props.value).toBe(birthCity.name)
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
  const countrySuggestion = screen.getByText(birthCountry.libcog)
  await userEvent.press(countrySuggestion)

  // Fill in the city input
  const cityOfBirthField = screen.getByTestId('Entrée pour la ville')
  await userEvent.type(cityOfBirthField, birthCity.name)

  // Select the suggested city
  const label = `${birthCity.name} (${birthCity.departementCode})`
  const citySuggestion = screen.getByText(label)
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
