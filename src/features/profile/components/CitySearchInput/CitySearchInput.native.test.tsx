import React from 'react'

import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/useCities'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/network/NetInfoWrapper')

const POSTAL_CODE = '83570'
const NEW_CALEDONIA_NORTHERN_PROVINCE_POSTAL_CODE = '98825'
const user = userEvent.setup()
jest.useFakeTimers()

describe('<CitySearchInput />', () => {
  beforeEach(() => {
    jest.spyOn(SettingsContextAPI, 'useSettingsContext').mockReturnValue({
      data: {
        ...defaultSettings,
        ineligiblePostalCodes: [NEW_CALEDONIA_NORTHERN_PROVINCE_POSTAL_CODE],
      },
      isLoading: false,
    })
  })

  it('should display error message when the user enters a valid postal code but no city found', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, [])
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByTestId('Entrée pour la ville')
    await user.type(input, POSTAL_CODE)

    await waitForScreenToBeLoaded()

    expect(
      await screen.findByText(
        'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).',
        { hidden: true }
      )
    ).toBeOnTheScreen()
  })

  it('should display an ineligible postal code message', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByTestId('Entrée pour la ville')
    await user.type(input, NEW_CALEDONIA_NORTHERN_PROVINCE_POSTAL_CODE)

    await waitForScreenToBeLoaded()

    expect(
      screen.getByText(
        'Malheureusement, ton code postal correspond à une zone qui n’est pas éligible au pass Culture.'
      )
    ).toBeOnTheScreen()
  })

  it('should display cities when the user enters a valid postal code', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByTestId('Entrée pour la ville')
    await user.type(input, POSTAL_CODE)

    await waitForScreenToBeLoaded()

    expect(await screen.findByText(mockedSuggestedCities[0].nom)).toBeOnTheScreen()
    expect(await screen.findByText(mockedSuggestedCities[1].nom)).toBeOnTheScreen()
  })

  it('should reset the search input when pressing the reset icon', async () => {
    mockServer.universalGet<CitiesResponse>(CITIES_API_URL, mockedSuggestedCities)
    render(reactQueryProviderHOC(<CitySearchInput />))

    const input = screen.getByTestId('Entrée pour la ville')
    await user.type(input, POSTAL_CODE)

    const resetIcon = screen.getByTestId('Réinitialiser la recherche')
    await user.press(resetIcon)

    await waitForScreenToBeLoaded()

    expect(input.props.value).toBe('')
  })
})

const waitForScreenToBeLoaded = () => {
  return screen.findByText('Indique ton code postal et choisis ta ville', { hidden: true })
}
