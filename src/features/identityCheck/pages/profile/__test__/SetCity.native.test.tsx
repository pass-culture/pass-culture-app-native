import { rest } from 'msw'
import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { CITIES_API_URL } from 'libs/place'
import * as fetchCities from 'libs/place/fetchCities'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse } from 'libs/place/useCities'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { cleanup, fireEvent, render, waitFor } from 'tests/utils'

const POSTAL_CODE = '83570'
const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

describe('<SetCity/>', () => {
  afterEach(cleanup)

  it('should render correctly', () => {
    const renderAPI = renderSetCity()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display error message when the user enters a valid postal code but no city found', async () => {
    mockCitiesApiCall([])
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetCity()

    const input = getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      getByText(
        'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'
      )
    })
  })

  it('should display cities when the user enters a valid postal code', async () => {
    mockCitiesApiCall(mockedSuggestedCities)
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetCity()

    const input = getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      getByText(mockedSuggestedCities[0].nom)
      getByText(mockedSuggestedCities[1].nom)
    })
  })

  it('should save city and navigate to next screen when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall(mockedSuggestedCities)
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetCity()

    const input = getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => getByText(city.nom))
    fireEvent.press(getByText(city.nom))
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      expect(mockNavigateToNextScreen).toBeCalledTimes(1)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_CITY',
        payload: {
          code: city.code,
          name: city.nom,
          postalCode: POSTAL_CODE,
        },
      })
    })
  })
})

function renderSetCity() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetCity />))
}

function mockCitiesApiCall(response: CitiesResponse) {
  const url = `${CITIES_API_URL}?codePostal=${POSTAL_CODE}`
  server.use(
    rest.get<CitiesResponse>(url, (req, res, ctx) => res(ctx.status(200), ctx.json(response)))
  )
}
