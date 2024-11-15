import React from 'react'

import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/useCities'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/network/NetInfoWrapper')

const POSTAL_CODE = '83570'
const NEW_CALEDONIA_NORTHERN_PROVINCE_POSTAL_CODE = '98825'

describe('<CitySearchInput />', () => {
  it('should display error message when the user enters a valid postal code but no city found', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, [])
    render(reactQueryProviderHOC(<CitySearchInput />))

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

  it('should display an ineligible postal code message', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, NEW_CALEDONIA_NORTHERN_PROVINCE_POSTAL_CODE)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Malheureusement, tu n’es pas éligible au pass Culture. Ton code postal est dans une région où nous ne sommes pas présents.'
        )
      ).toBeOnTheScreen()
    })
  })

  it('should display cities when the user enters a valid postal code', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedCities[0].nom)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedCities[1].nom)).toBeOnTheScreen()
    })
  })

  it('should reset the search input when pressing the reset icon', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    const resetIcon = screen.getByTestId('Réinitialiser la recherche')
    fireEvent.press(resetIcon)

    await waitFor(() => {
      expect(input.props.value).toBe('')
    })
  })
})
