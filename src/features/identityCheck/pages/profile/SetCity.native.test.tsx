import { rest } from 'msw'
import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { amplitude } from 'libs/amplitude'
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

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
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

  it('should save city and navigate to next screen when clicking on "Continuer"', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall(mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    await screen.findByText(city.nom)
    fireEvent.press(screen.getByText(city.nom))
    fireEvent.press(screen.getByText('Continuer'))

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

  it('should send a amplitude event when the screen is mounted', async () => {
    renderSetCity()

    expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_city')
  })

  it('should send an amplitude event set_postal_code_clicked on press Continuer', async () => {
    const city = mockedSuggestedCities[0]
    mockCitiesApiCall(mockedSuggestedCities)
    renderSetCity()

    const input = screen.getByPlaceholderText('Ex\u00a0: 75017')
    fireEvent.changeText(input, POSTAL_CODE)

    const CityNameButton = await screen.findByText(city.nom)
    fireEvent.press(CityNameButton)

    const ContinueButton = screen.getByText('Continuer')
    fireEvent.press(ContinueButton)

    // first call will be the event screen_view_set_city on mount
    expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_postal_code_clicked')
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
