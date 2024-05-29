import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { analytics } from 'libs/analytics'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/useCities'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')

const POSTAL_CODE = '83570'

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    renderSetCity()

    expect(screen).toMatchSnapshot()
  })

  it('should display error message when the user enters a valid postal code but no city found', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, [])
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'
        )
      ).toBeOnTheScreen()
    })
  })

  it('should display cities when the user enters a valid postal code', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedCities[0].nom)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedCities[1].nom)).toBeOnTheScreen()
    })
  })

  it('should navigate to SetAddress when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await screen.findByText(city.nom)
    fireEvent.press(screen.getByText(city.nom))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(async () => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress')
    })
  })

  it('should save city in storage when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await screen.findByText(city.nom)
    fireEvent.press(screen.getByText(city.nom))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(async () => {
      expect(await storage.readObject('profile-city')).toMatchObject({
        state: {
          city: { name: city.nom, code: city.code, postalCode: POSTAL_CODE },
        },
      })
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetCity()

    expect(analytics.logScreenViewSetCity).toHaveBeenCalledTimes(1)
  })

  it('should log analytics on press Continuer', async () => {
    const city = mockedSuggestedCities[0]
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    const CityNameButton = await screen.findByText(city.nom)
    fireEvent.press(CityNameButton)

    const ContinueButton = screen.getByText('Continuer')
    fireEvent.press(ContinueButton)

    await waitFor(() => {
      expect(analytics.logSetPostalCodeClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetCity() {
  return render(reactQueryProviderHOC(<SetCity />))
}
