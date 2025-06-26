import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { analytics } from 'libs/analytics/provider'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CITIES_API_URL, CitiesResponse } from 'libs/place/useCities'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/network/NetInfoWrapper')

const POSTAL_CODE = '83570'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    renderSetCity()

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetCity()

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    })
    renderSetCity()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to SetAddress with identityCheck params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress', {
      type: ProfileTypes.IDENTITY_CHECK,
    })
  })

  it('should navigate to SetAddress with booking params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    })
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    }) // re-render
    renderSetCity()

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress', {
      type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
    })
  })

  it('should save city in storage when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(await storage.readObject('profile-city')).toMatchObject({
      state: {
        city: { name: city.nom, code: city.code, postalCode: POSTAL_CODE },
      },
    })
  })

  it('should log analytics on press Continuer', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(analytics.logSetPostalCodeClicked).toHaveBeenCalledTimes(1)
  })
})

const renderSetCity = () => {
  return render(reactQueryProviderHOC(<SetCity />))
}
