import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { analytics } from 'libs/analytics'
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

    await screen.findByText('Recherche et sélectionne ton adresse')

    expect(screen).toMatchSnapshot()
  })

  it('should display a list of addresses when user add an address', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedPlaces.features[0].properties.label)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[1].properties.label)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[2].properties.label)).toBeOnTheScreen()
    })
  })

  it('should save address and navigate to SetStatus when clicking on "Continuer"', async () => {
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
    expect(navigate).toHaveBeenNthCalledWith(1, 'SetStatus')
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetAddress()

    await screen.findByText('Recherche et sélectionne ton adresse')

    await waitFor(() => expect(analytics.logScreenViewSetAddress).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    fireEvent.press(screen.getByText('Continuer'))

    await screen.findByText('Recherche et sélectionne ton adresse')

    await waitFor(() => expect(analytics.logSetAddressClicked).toHaveBeenCalledTimes(1))
  })
})

function renderSetAddress() {
  return render(
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress />
      </SettingsWrapper>
    )
  )
}
