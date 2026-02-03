import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { InseeCountry } from 'features/bonification/inseeCountries'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn(),
  }),
}))

const title = 'Monsieur'
const firstName = 'Jean'
const givenName = 'Dupont'
const commonName = 'Dubois'
const birthDate = '1975-10-10T00:00:00.000Z'
const birthCountry: InseeCountry = { LIBCOG: 'Belgique', COG: 99131 }

describe('BonificationRecap', () => {
  beforeEach(() => {
    const { resetLegalRepresentative } = legalRepresentativeActions
    resetLegalRepresentative()
  })

  it('should navigate to name screen when pressing "Modifier mes informations"', async () => {
    prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

    const button = screen.getByText('Modifier mes informations')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationNames',
    })
  })

  it('should show previously saved data', () => {
    prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

    expect(screen.getByText('Civilité')).toBeTruthy()
    expect(screen.getByText(title)).toBeTruthy()

    expect(screen.getByText('Nom de naissance')).toBeTruthy()
    expect(screen.getByText(givenName.toUpperCase())).toBeTruthy()

    expect(screen.getByText('Prénom(s)')).toBeTruthy()
    expect(screen.getByText(firstName)).toBeTruthy()

    expect(screen.getByText('Nom d’usage')).toBeTruthy()
    expect(screen.getByText(commonName.toUpperCase())).toBeTruthy()

    expect(screen.getByText('Pays de naissance')).toBeTruthy()
    expect(screen.getByText(birthCountry.libcog)).toBeTruthy()
    expect(screen.getByText(new Date(birthDate).toLocaleDateString())).toBeTruthy()
  })

  it('should navigate to error screen when pressing "Envoyer" and data is missing', async () => {
    prepareDataAndRender(undefined, undefined, undefined, undefined, undefined, undefined)

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

    it('should navigate to home', async () => {
      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })

    it('should show snackbar', async () => {
      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tes informations ont été envoyées\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should refresh the user', async () => {
      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

      await validateAndSubmitForm()

      expect(mockRefetchUser).toHaveBeenCalledTimes(1)
    })

    it('should clear previously saved data', async () => {
      const resetLegalRepresentativeSpy = jest.spyOn(
        legalRepresentativeActions,
        'resetLegalRepresentative'
      )

      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

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

    it('should navigate to error screen when pressing "Confirmer"', async () => {
      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

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
    'Je certifie avoir informé mon parent ou mon représentant légal des données personnelles communiquées'
  )
  await userEvent.press(checkbox)

  const button = screen.getByText('Confirmer')
  await userEvent.press(button)
}

function prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry) {
  const { setTitle, setFirstNames, setGivenName, setCommonName, setBirthDate, setBirthCountry } =
    legalRepresentativeActions
  setTitle(title)
  setFirstNames([firstName])
  setGivenName(givenName)
  setCommonName(commonName)
  setBirthDate(new Date(birthDate))
  setBirthCountry(birthCountry)
  render(reactQueryProviderHOC(<BonificationRecap />))
}
