import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/useCities'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/network/NetInfoWrapper')

const POSTAL_CODE = '83570'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking', async () => {
    renderSetCity({ type: ProfileTypes.BOOKING })

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to SetAddress with identityCheck params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    await act(async () => {
      const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Continuer'))
    })

    await waitFor(async () => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress', {
        type: ProfileTypes.IDENTITY_CHECK,
      })
    })
  })

  it('should navigate to SetAddress with booking params when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.BOOKING })

    await act(async () => {
      const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      fireEvent.press(screen.getByText(city.nom))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Continuer'))
    })

    await waitFor(async () => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress', {
        type: ProfileTypes.BOOKING,
      })
    })
  })

  it('should save city in storage when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    await act(async () => {
      const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      const cityInput = screen.getByText(city.nom)
      fireEvent.press(cityInput)
    })

    await act(async () => {
      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)
    })

    await waitFor(async () => {
      expect(await storage.readObject('profile-city')).toMatchObject({
        state: {
          city: { name: city.nom, code: city.code, postalCode: POSTAL_CODE },
        },
      })
    })
  })

  it('should log analytics on press Continuer', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

    await act(async () => {
      const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
      fireEvent.changeText(input, POSTAL_CODE)
    })

    await screen.findByText(city.nom)
    await act(async () => {
      const cityInput = screen.getByText(city.nom)
      fireEvent.press(cityInput)
    })

    await act(async () => {
      const ContinueButton = screen.getByText('Continuer')
      fireEvent.press(ContinueButton)
    })

    await waitFor(() => {
      expect(analytics.logSetPostalCodeClicked).toHaveBeenCalledTimes(1)
    })
  })
})

const renderSetCity = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetCity'
  >
  return render(reactQueryProviderHOC(<SetCity {...navProps} />))
}
