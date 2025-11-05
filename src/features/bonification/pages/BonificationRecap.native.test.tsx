import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
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
const birthCountry = 'Belgique' // Cog: 99131

describe('BonificationRecap', () => {
  beforeEach(() => {
    const { resetLegalRepresentative } = legalRepresentativeActions
    resetLegalRepresentative()
    mockServer.postApi('/v1/subscription/bonus/quotient_familial', {
      responseOptions: { statusCode: 400 },
    })
  })

  it('should navigate when pressing "Envoyer" when checkbox is checked', async () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const checkbox = screen.getByText(
      'Je déclare que l’ensemble des informations que j’ai renseignées sont correctes.'
    )
    await userEvent.press(checkbox)

    const button = screen.getByText('Envoyer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationError')
  })

  it('should navigate to first screen when pressing "Modifier les informations"', async () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const button = screen.getByText('Modifier les informations')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationNames')
  })

  it('should show previously saved data', () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const nameField = screen.getByText('Monsieur Jean DUPONT')
    const countryField = screen.getByText(birthCountry)
    const birthDateField = screen.getByText(new Date(birthDate).toLocaleDateString())

    expect(nameField).toBeTruthy()
    expect(countryField).toBeTruthy()
    expect(birthDateField).toBeTruthy()
  })

  // un skip in PC-38479 when we fix country field
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should clear previously saved data when submitting the data', async () => {
    const resetLegalRepresentativeSpy = jest.spyOn(
      legalRepresentativeActions,
      'resetLegalRepresentative'
    )

    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const checkbox = screen.getByText(
      'Je déclare que l’ensemble des informations que j’ai renseignées sont correctes.'
    )
    await userEvent.press(checkbox)

    const button = screen.getByText('Envoyer')
    await userEvent.press(button)

    expect(resetLegalRepresentativeSpy).toHaveBeenCalledWith()
  })

  it('should navigate to error screen if store is missing data', async () => {
    expect(() => render(reactQueryProviderHOC(<BonificationRecap />))).toThrow(
      new Error("Couldn't retrieve data from storage")
    )
  })
})

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
