import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetPostalCode } from 'features/identityCheck/pages/profile/SetPostalCode'
import { CitiesResponse, CITIES_API_URL } from 'libs/place/fetchCities'
import * as fetchCities from 'libs/place/fetchCities'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { server } from 'tests/server'
import { cleanup, fireEvent, render, waitFor } from 'tests/utils'

const POSTAL_CODE = '83570'

describe('<SetPostalCode/>', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render correctly', () => {
    const renderAPI = render(<SetPostalCode />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display error message when clicking on "Continuer" button and no city is found', async () => {
    mockCitiesApiCall([])
    const mockedGetCitiesSpy = jest.spyOn(fetchCities, 'fetchCities')
    const { getByText, getByPlaceholderText } = render(<SetPostalCode />)

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
    const { getByText, getByPlaceholderText } = render(<SetPostalCode />)

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
})

function mockCitiesApiCall(response: CitiesResponse) {
  server.use(
    rest.get<CitiesResponse>(
      `${CITIES_API_URL}?codePostal=${POSTAL_CODE}`,
      async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(response))
      }
    )
  )
}
