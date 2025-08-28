import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CITIES_API_URL, CitiesResponse } from 'libs/place/useCities'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
mockAuthContextWithUser(beneficiaryUser)

const patchProfileSpy = jest.spyOn(API.api, 'patchNativeV1Profile')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))
jest.mock('libs/firebase/analytics/analytics')

const POSTAL_CODE = '83570'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('ChangeCity', () => {
  describe('without previous screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { type: undefined } })
      mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', beneficiaryUser)
    })

    it('should render correctly', async () => {
      render(reactQueryProviderHOC(<ChangeCity />))

      expect(screen).toMatchSnapshot()
    })

    it('should update profile when clicking on "Valider ma ville de résidence"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Valider ma ville de résidence'))

      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        city: city.nom,
        postalCode: POSTAL_CODE,
      })
    })

    it('should navigate to PersonalData when clicking on "Valider ma ville de résidence"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Valider ma ville de résidence'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
        params: undefined,
        screen: 'PersonalData',
      })
    })

    it('should show snackbar on success', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Valider ma ville de résidence'))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ta ville de résidence a bien été modifiée\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should send analytics when success', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Valider ma ville de résidence'))

      expect(analytics.logUpdatePostalCode).toHaveBeenCalledWith({
        oldPostalCode: beneficiaryUser.postalCode,
        oldCity: beneficiaryUser.city,
        newPostalCode: POSTAL_CODE,
        newCity: city.nom,
      })
    })

    it('should show snackbar on error', async () => {
      const city = mockedSuggestedCities[0]
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {
        responseOptions: { statusCode: 400 },
      })
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Valider ma ville de résidence'))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('from profil personal data screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { type: PersonalDataTypes.PROFIL_PERSONAL_DATA } })
      mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', beneficiaryUser)
    })

    it('should render correctly', async () => {
      render(reactQueryProviderHOC(<ChangeCity />))

      expect(screen).toMatchSnapshot()
    })

    it('should update profile when clicking on "Continuer"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        city: city.nom,
        postalCode: POSTAL_CODE,
      })
    })

    it('should navigate to ChangeAddress when clicking on "Continuer"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
        params: { type: PersonalDataTypes.PROFIL_PERSONAL_DATA },
        screen: 'ChangeAddress',
      })
    })

    it('should not show snackbar on success', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
    })
  })

  describe('from mandatory udpate personal data screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
      })
      mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', beneficiaryUser)
    })

    it('should render correctly', async () => {
      render(reactQueryProviderHOC(<ChangeCity />))

      expect(screen).toMatchSnapshot()
    })

    it('should update profile when clicking on "Continuer"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        city: city.nom,
        postalCode: POSTAL_CODE,
      })
    })

    it('should navigate to ChangeAddress when clicking on "Continuer"', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
        screen: 'ChangeAddress',
      })
    })

    it('should not show snackbar on success', async () => {
      const city = mockedSuggestedCities[0]
      render(reactQueryProviderHOC(<ChangeCity />))

      const input = await screen.findByTestId('Entrée pour la ville')
      await act(async () => fireEvent.changeText(input, POSTAL_CODE))
      await user.press(await screen.findByText(city.nom))
      await user.press(await screen.findByText('Continuer'))

      expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
    })
  })
})
