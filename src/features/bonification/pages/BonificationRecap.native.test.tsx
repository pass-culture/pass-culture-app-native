import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

const title = 'Monsieur'
const firstName = 'Jean'
const givenName = 'Dupont'
const birthDate = '1975-10-10T00:00:00.000Z'
const birthCountry = 'Belgique'

describe('BonificationRecap', () => {
  beforeEach(() => {
    const { resetLegalRepresentative } = legalRepresentativeActions
    resetLegalRepresentative()
  })

  it('should navigate to next form when pressing "Envoyer" when checkbox is checked', async () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const checkbox = screen.getByText(
      'Je déclare que l’ensemble des informations que j’ai renseignées sont correctes.'
    )
    await userEvent.press(checkbox)

    const button = screen.getByText('Envoyer')
    await userEvent.press(button)

    await jest.runAllTimers() // to account for the setTimout (will be removed when real API is called)

    expect(navigate).toHaveBeenCalledWith('BonificationError')
  })

  it('should go navigate to first screen when pressing "Modifier les informations"', async () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const button = screen.getByText('Modifier les informations')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationNames')
  })

  it('should show previously saved data', () => {
    prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry)

    const nameField = screen.getByText('Monsieur Jean Dupont')
    const countryField = screen.getByText(birthCountry)
    const birthDateField = screen.getByText(new Date(birthDate).toLocaleDateString())

    expect(nameField).toBeTruthy()
    expect(countryField).toBeTruthy()
    expect(birthDateField).toBeTruthy()
  })

  it('should clear previously saved data when submitting the data', async () => {
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

    await jest.runAllTimers() // to account for the setTimout (will be removed when real API is called)

    expect(resetLegalRepresentativeSpy).toHaveBeenCalledWith()
  })
})

function prepareDataAndRender(title, firstName, givenName, birthDate, birthCountry) {
  const { setTitle, setFirstName, setGivenName, setBirthDate, setBirthCountry } =
    legalRepresentativeActions
  setTitle(title)
  setFirstName(firstName)
  setGivenName(givenName)
  setBirthDate(new Date(birthDate))
  setBirthCountry(birthCountry)
  render(<BonificationRecap />)
}
