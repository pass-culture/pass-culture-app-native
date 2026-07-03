import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { InseeCountry } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { disabilityBonificationActions } from 'features/bonification/store/disabilityBonificationStore'
import { qfBonificationActions } from 'features/bonification/store/qfBonificationStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const title = 'Monsieur'
const firstName = 'Jean'
const givenName = 'Dupont'
const commonName = 'Dubois'
const birthDate = '1975-10-10T00:00:00.000Z'
const birthCountry: InseeCountry = { libcog: 'Belgique', cog: 99131 }

describe('BonificationRecap', () => {
  describe('Family quotient bonification', () => {
    beforeEach(() => {
      const { resetQFBonification } = qfBonificationActions
      resetQFBonification()
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.FAMILY_QUOTIENT } })
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
        params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
        screen: 'BonificationError',
      })
    })

    it('should display correct checkbox label', async () => {
      prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)

      expect(
        screen.getByText(
          'Je certifie avoir informé mon parent ou mon représentant légal des données personnelles communiquées.'
        )
      ).toBeTruthy()
    })

    describe('when submission succeeds', () => {
      beforeEach(() => {
        mockServer.postApi('/v1/subscription/bonus/quotient_familial', {
          responseOptions: { statusCode: 204 },
        })
      })

      it('should show snackbar', async () => {
        prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)
        await validateAndSubmitForm()

        expect(await screen.findByTestId('snackbar-success')).toBeOnTheScreen()
        expect(screen.getByText('Tes informations ont été envoyées\u00a0!')).toBeOnTheScreen()
      })

      it('should navigate to home', async () => {
        prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)
        await validateAndSubmitForm()

        expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
      })

      it('should refresh the user', async () => {
        prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)
        await validateAndSubmitForm()

        expect(mockRefetchUser).toHaveBeenCalledTimes(1)
      })

      it('should clear previously saved data', async () => {
        const resetQFBonificationSpy = jest.spyOn(qfBonificationActions, 'resetQFBonification')

        prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry)
        await validateAndSubmitForm()

        expect(resetQFBonificationSpy).toHaveBeenCalledWith()
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
          params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
          screen: 'BonificationError',
        })
      })
    })

    it('should show error message if store is missing data', async () => {
      render(reactQueryProviderHOC(<BonificationRecap />))
      const errorMessage = await screen.findByText(
        'Nous ne retrouvons pas les données du formulaire'
      )

      expect(errorMessage).toBeTruthy()
    })
  })

  describe('Disability bonification', () => {
    beforeEach(() => {
      const { resetDisabilityBonification } = disabilityBonificationActions
      resetDisabilityBonification()
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.DISABILITY } })
    })

    it('should display step 2 on 2', () => {
      prepareDataAndRender2(birthCountry)

      expect(screen.getByText('Étape 2 sur 2')).toBeTruthy()
    })

    it('should display correct checkbox label', async () => {
      prepareDataAndRender2(birthCountry)

      expect(
        screen.getByText('Je certifie que les informations saisies sont exactes.')
      ).toBeTruthy()
    })

    it('should navigate to birth place screen when pressing "Modifier mes informations"', async () => {
      prepareDataAndRender2(birthCountry)

      const button = screen.getByText('Modifier mes informations')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationBirthPlace',
      })
    })

    it('should navigate to error screen when data is missing', async () => {
      prepareDataAndRender2(undefined)

      await validateAndSubmitForm()

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationError',
      })
    })

    describe('when submission succeeds', () => {
      beforeEach(() => {
        mockServer.postApi('/v1/subscription/bonus/disability', {
          responseOptions: { statusCode: 204 },
        })
      })

      it('should show snackbar', async () => {
        prepareDataAndRender2(birthCountry)

        await validateAndSubmitForm()

        expect(await screen.findByTestId('snackbar-success')).toBeOnTheScreen()
      })

      it('should navigate to home', async () => {
        prepareDataAndRender2(birthCountry)

        await validateAndSubmitForm()

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: undefined,
          screen: 'Home',
        })
      })

      it('should refresh user', async () => {
        prepareDataAndRender2(birthCountry)

        await validateAndSubmitForm()

        expect(mockRefetchUser).toHaveBeenCalledTimes(1)
      })

      it('should clear store', async () => {
        const resetSpy = jest.spyOn(qfBonificationActions, 'resetQFBonification')

        prepareDataAndRender2(birthCountry)

        await validateAndSubmitForm()

        expect(resetSpy).not.toHaveBeenCalled()
      })
    })

    describe('when submission fails', () => {
      beforeEach(() => {
        mockServer.postApi('/v1/subscription/bonus/disability', {
          responseOptions: { statusCode: 400 },
        })
      })

      it('should navigate to error screen', async () => {
        prepareDataAndRender2(birthCountry)

        await validateAndSubmitForm()

        expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
          params: { bonificationType: BonificationType.DISABILITY },
          screen: 'BonificationError',
        })
      })
    })
  })
})

async function validateAndSubmitForm() {
  const checkbox = screen.getByText(/Je certifie/)
  await userEvent.press(checkbox)

  const button = screen.getByText('Confirmer')
  await userEvent.press(button)
}

function prepareDataAndRender(title, firstName, givenName, commonName, birthDate, birthCountry) {
  const { setTitle, setFirstNames, setGivenName, setCommonName, setBirthDate, setBirthCountry } =
    qfBonificationActions
  setTitle(title)
  setFirstNames([firstName])
  setGivenName(givenName)
  setCommonName(commonName)
  setBirthDate(new Date(birthDate))
  setBirthCountry(birthCountry)
  render(reactQueryProviderHOC(<BonificationRecap />))
}

function prepareDataAndRender2(birthCountry) {
  const { setBirthCountry } = disabilityBonificationActions
  setBirthCountry(birthCountry)
  render(reactQueryProviderHOC(<BonificationRecap />))
}
