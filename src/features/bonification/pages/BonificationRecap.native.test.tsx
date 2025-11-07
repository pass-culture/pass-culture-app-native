import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { InseeCountry } from 'features/bonification/inseeCountries'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')

const title = 'Monsieur'
const firstName = 'Jean'
const givenName = 'Dupont'
const birthDate = '1975-10-10T00:00:00.000Z'
const birthCountry: InseeCountry = { LIBCOG: 'Belgique', COG: 99131 }

describe('BonificationRecap', () => {
  beforeEach(() => {
    const { resetLegalRepresentative } = legalRepresentativeActions
    resetLegalRepresentative()
  })

  it('should navigate to name screen when pressing "Modifier les informations"', async () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const button = screen.getByText('Modifier les informations')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationNames',
    })
  })

  it('should show previously saved data', () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const nameField = screen.getByText('Monsieur Jean DUPONT')
    const countryField = screen.getByText(birthCountry.LIBCOG)
    const birthDateField = screen.getByText(new Date(birthDate).toLocaleDateString())

    expect(nameField).toBeTruthy()
    expect(countryField).toBeTruthy()
    expect(birthDateField).toBeTruthy()
  })

  it('should navigate to error screen when pressing "Envoyer" and data is missing', async () => {
    prepareDataAndRender(undefined, undefined, undefined, undefined, undefined)

    await validateAndSubmitForm()

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationError',
    })
  })

  describe('when submission succeeds', () => {
    beforeEach(() => {
      mockServer.postApi('/v1/subscription/bonus/quotient_familial', {
        responseOptions: { statusCode: 204 },
      })
    })

    it('should navigate to home when pressing "Envoyer"', async () => {
      prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })

    it('should clear previously saved data', async () => {
      const resetLegalRepresentativeSpy = jest.spyOn(
        legalRepresentativeActions,
        'resetLegalRepresentative'
      )

      prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(resetLegalRepresentativeSpy).toHaveBeenCalledWith()
    })
  })

  describe('when submission fails', () => {
    beforeEach(() => {
      mockServer.postApi('/v1/subscription/bonus/quotient_familial', {
        responseOptions: { statusCode: 400 },
      })
    })

    it('should navigate to error screen when pressing "Envoyer"', async () => {
      prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'BonificationError',
      })
    })
  })

  it('should show error message if store is missing data', async () => {
    render(reactQueryProviderHOC(<BonificationRecap />))
    const errorMessage = await screen.findByText('Nous ne retrouvons pas les données du formulaire')

    expect(errorMessage).toBeTruthy()
  })
})

async function validateAndSubmitForm() {
  const checkbox = screen.getByText(
    'Je déclare que l’ensemble des informations que j’ai renseignées sont correctes.'
  )
  await userEvent.press(checkbox)

  const button = screen.getByText('Envoyer')
  await userEvent.press(button)
}

function prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry) {
  const { setTitle, setFirstNames, setGivenName, setBirthDate, setBirthCountry } =
    legalRepresentativeActions
  setTitle(title)
  setFirstNames([firstName])
  setGivenName(givenName)
  setBirthDate(new Date(birthDate))
  setBirthCountry(birthCountry)
  render(reactQueryProviderHOC(<BonificationRecap />))
}
