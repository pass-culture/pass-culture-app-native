import { rest } from 'msw'
import React from 'react'

import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { amplitude } from 'libs/amplitude'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

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

const QUERY_ADDRESS = '1 rue Poissonnière'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

server.use(
  rest.get('https://api-adresse.data.gouv.fr/search', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedSuggestedPlaces))
  )
)

describe('<SetAddress/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it('should render correctly', async () => {
    renderSetAddress()

    await waitFor(() => {
      expect(screen).toMatchSnapshot()
    })
  })

  it('should display a list of addresses when user add an address', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedPlaces.features[0].properties.label)).toBeTruthy()
      expect(screen.getByText(mockedSuggestedPlaces.features[1].properties.label)).toBeTruthy()
      expect(screen.getByText(mockedSuggestedPlaces.features[2].properties.label)).toBeTruthy()
    })
  })

  it('should save address and navigate to next screen when clicking on "Continuer"', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await screen.findByText(mockedSuggestedPlaces.features[1].properties.label)
    fireEvent.press(screen.getByText(mockedSuggestedPlaces.features[1].properties.label))
    fireEvent.press(screen.getByText('Continuer'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_ADDRESS',
      payload: mockedSuggestedPlaces.features[1].properties.label,
    })
    expect(mockNavigateToNextScreen).toBeCalledTimes(1)
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    renderSetAddress()

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_address')
    )
  })

  it('should send a amplitude event set_address_clicked on press Continuer', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() =>
      // first call will be the event screen_view_set_address on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_address_clicked')
    )
  })
})

function renderSetAddress() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress />
      </SettingsWrapper>
    )
  )
}
