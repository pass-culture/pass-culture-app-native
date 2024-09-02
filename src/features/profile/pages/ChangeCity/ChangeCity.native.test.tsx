import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/useCities'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
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

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    render(reactQueryProviderHOC(<ChangeCity />))

    expect(screen).toMatchSnapshot()
  })

  it('should update profile', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

    render(reactQueryProviderHOC(<ChangeCity />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    await act(async () => {
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Valider ma ville de résidence'))
    })

    await waitFor(async () => {
      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        city: city.nom,
        postalCode: POSTAL_CODE,
      })
    })
  })

  it('should navigate to PersonalData when clicking on "Valider"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

    render(reactQueryProviderHOC(<ChangeCity />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    await act(async () => {
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Valider ma ville de résidence'))
    })

    await waitFor(async () => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'PersonalData')
    })
  })

  it('should show snackbar on success', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

    render(reactQueryProviderHOC(<ChangeCity />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    await act(async () => {
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Valider ma ville de résidence'))
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ta ville de résidence a bien été modifiée\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should send analytics when success', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

    render(reactQueryProviderHOC(<ChangeCity />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    await act(async () => {
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Valider ma ville de résidence'))
    })

    expect(analytics.logUpdatePostalCode).toHaveBeenCalledWith({
      oldPostalCode: beneficiaryUser.postalCode,
      oldCity: beneficiaryUser.city,
      newPostalCode: POSTAL_CODE,
      newCity: city.nom,
    })
  })

  it('should show snackbar on error', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    mockServer.patchApi<UserProfileResponse>('/v1/profile', {
      responseOptions: { statusCode: 400 },
    })
    render(reactQueryProviderHOC(<ChangeCity />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    await act(async () => {
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Valider ma ville de résidence'))
    })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Une erreur est survenue',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})
