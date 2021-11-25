import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetPostalCode } from 'features/identityCheck/pages/profile/SetPostalCode'
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
  useIdentityCheckContext: () => ({ dispatch: mockDispatch }),
}))

describe('<SetPostalCode/>', () => {
  afterEach(cleanup)

  it('should render correctly', () => {
    const renderAPI = renderSetPostaCode()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display error message when clicking on "Continuer" button and no city is found', async () => {
    mockCitiesApiCall([])
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetPostaCode()

    const input = getByPlaceholderText('Ex : 75017')
    fireEvent.changeText(input, POSTAL_CODE)
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      getByText(
        'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'
      )
    })
  })

  it('should display cities modal when clicking on "Continuer" button and multiple cities are found', async () => {
    mockCitiesApiCall(mockedSuggestedCities)
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetPostaCode()

    const input = getByPlaceholderText('Ex : 75017')
    fireEvent.changeText(input, POSTAL_CODE)
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      getByText(mockedSuggestedCities[0].nom)
      getByText(mockedSuggestedCities[1].nom)
      expect(navigate).not.toBeCalled()
    })
  })

  it('should save city when clicking on "Continuer" and only one city found', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall([city])
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')

    const { getByText, getByPlaceholderText } = renderSetPostaCode()

    const input = getByPlaceholderText('Ex : 75017')
    fireEvent.changeText(input, POSTAL_CODE)
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, POSTAL_CODE)
      getByText(city.nom)
      expect(navigate).not.toBeCalled()
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

function renderSetPostaCode() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetPostalCode />))
}

function mockCitiesApiCall(response: CitiesResponse) {
  const url = `${CITIES_API_URL}?codePostal=${POSTAL_CODE}`
  server.use(
    rest.get<CitiesResponse>(url, (req, res, ctx) => res(ctx.status(200), ctx.json(response)))
  )
}
