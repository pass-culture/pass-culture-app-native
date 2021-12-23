import { FeatureCollection, Point } from 'geojson'
import { rest } from 'msw'
import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { eventMonitoring } from 'libs/monitoring'
import { Properties } from 'libs/place'
import { buildPlaceUrl } from 'libs/place/buildUrl'
import * as fetchAddresses from 'libs/place/fetchAddresses'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

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

const QUERY_CITY_CODE = ''
const QUERY_ADDRESS = '1 rue Poissonnière'
const QUERY_POSTAL_CODE = ''

const url = buildPlaceUrl({
  query: QUERY_ADDRESS,
  cityCode: QUERY_CITY_CODE,
  postalCode: QUERY_POSTAL_CODE,
  limit: 10,
})

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

describe('<SetAddress/>', () => {
  it('should render correctly', () => {
    const renderAPI = renderSetAddresse()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display a list of addresses when user add an address', async () => {
    mockAddressesApiCall(mockedSuggestedPlaces)
    const mockedGetCitiesSpy = jest.spyOn(fetchAddresses, 'fetchAddresses')

    const { getByText, getByPlaceholderText } = renderSetAddresse()

    const input = getByPlaceholderText("Ex\u00a0: 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, {
        query: QUERY_ADDRESS,
        postalCode: QUERY_POSTAL_CODE,
        limit: 10,
        cityCode: QUERY_CITY_CODE,
      })
      getByText(mockedSuggestedPlaces.features[0].properties.label)
      getByText(mockedSuggestedPlaces.features[1].properties.label)
      getByText(mockedSuggestedPlaces.features[2].properties.label)
    })
  })

  it('should save address and navigate to next screen when clicking on "Continuer"', async () => {
    mockAddressesApiCall(mockedSuggestedPlaces)

    const { getByText, getByPlaceholderText } = renderSetAddresse()

    const input = getByPlaceholderText("Ex\u00a0: 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => getByText(mockedSuggestedPlaces.features[1].properties.label))
    fireEvent.press(getByText(mockedSuggestedPlaces.features[1].properties.label))
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_ADDRESS',
        payload: mockedSuggestedPlaces.features[1].properties.label,
      })
      expect(mockNavigateToNextScreen).toBeCalledTimes(1)
    })
  })

  // TODO(antoinewg): make this test work
  it.skip('should show the generic error message if the API call returns error', async () => {
    mockAddressesApiCallError()
    const mockedGetCitiesSpy = jest.spyOn(fetchAddresses, 'fetchAddresses')

    const { getByPlaceholderText } = renderSetAddresse()

    const input = getByPlaceholderText("Ex\u00a0: 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(mockedGetCitiesSpy).toHaveBeenNthCalledWith(1, {
        query: QUERY_ADDRESS,
        postalCode: QUERY_POSTAL_CODE,
        limit: 10,
        cityCode: QUERY_CITY_CODE,
      })

      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`,
        timeout: 5000,
      })
      expect(eventMonitoring.captureException).toBeCalledWith(
        new IdentityCheckError(
          'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'
        )
      )
    })
  })
})

function renderSetAddresse() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetAddress />))
}

function mockAddressesApiCall(response: FeatureCollection<Point, Properties>) {
  server.use(rest.get(url, (req, res, ctx) => res(ctx.status(200), ctx.json(response))))
}

function mockAddressesApiCallError() {
  server.use(rest.get(url, (req, res, ctx) => res(ctx.status(400))))
}
