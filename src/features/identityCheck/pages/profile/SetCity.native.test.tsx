import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
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
    renderSetCity()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SetAddress when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

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
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress')
    })
  })

  it('should save city in storage when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

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
    renderSetCity()

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

function renderSetCity() {
  return render(reactQueryProviderHOC(<SetCity />))
}
