import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { analytics } from 'libs/analytics'
import { CITIES_API_URL } from 'libs/place'
import { mockedSuggestedCities } from 'libs/place/fixtures/mockedSuggestedCities'
import { CitiesResponse } from 'libs/place/useCities'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const POSTAL_CODE = '83570'
const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    renderSetCity()

    expect(screen).toMatchSnapshot()
  })

  it('should display error message when the user enters a valid postal code but no city found', async () => {
    mockCitiesApiCall([])
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'
        )
      ).toBeTruthy()
    })
  })

  it('should display cities when the user enters a valid postal code', async () => {
    mockCitiesApiCall(mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedCities[0].nom)).toBeTruthy()
      expect(screen.getByText(mockedSuggestedCities[1].nom)).toBeTruthy()
    })
  })

  it('should save city and navigate to SetAddress when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall(mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await screen.findByText(city.nom)
    fireEvent.press(screen.getByText(city.nom))
    fireEvent.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetAddress')
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_CITY',
      payload: {
        code: city.code,
        name: city.nom,
        postalCode: POSTAL_CODE,
      },
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetCity()

    expect(analytics.logScreenViewSetCity).toHaveBeenCalledTimes(1)
  })

  it('should log analytics on press Continuer', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall(mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    const CityNameButton = await screen.findByText(city.nom)
    fireEvent.press(CityNameButton)

    const ContinueButton = screen.getByText('Continuer')
    fireEvent.press(ContinueButton)

    expect(analytics.logSetPostalCodeClicked).toHaveBeenCalledTimes(1)
  })
})

function renderSetCity() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetCity />))
}

function mockCitiesApiCall(response: CitiesResponse) {
  server.use(
    rest.get<CitiesResponse>(CITIES_API_URL, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(response))
    )
  )
}
