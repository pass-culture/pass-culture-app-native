import React from 'react'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CITIES_API_URL, CitiesResponse } from 'libs/place/useCities'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

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

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    renderSetCity({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to SetAddress with identityCheck params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SubscriptionStackNavigator', {
      params: {
        type: ProfileTypes.IDENTITY_CHECK,
      },
      screen: 'SetAddress',
    })
  })

  it('should navigate to SetAddress with booking params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SubscriptionStackNavigator', {
      params: {
        type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
      },
      screen: 'SetAddress',
    })
  })

  it('should save city in storage when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    await act(async () => {
      const input = screen.getByTestId('Entrée pour la ville')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await user.press(screen.getByText(city.nom))

    await user.press(screen.getByText('Continuer'))

    expect(await storage.readObject('profile-city')).toMatchObject({
      state: {
        city: { name: city.nom, code: city.code, postalCode: POSTAL_CODE },
      },
    })
  })
})

const renderSetCity = (navigationParams: { type: string }) => {
  useRoute.mockReturnValue({ params: navigationParams })
  return render(reactQueryProviderHOC(<SetCity />))
}
