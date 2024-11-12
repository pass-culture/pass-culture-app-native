import { FeatureCollection, Point } from 'geojson'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { analytics } from 'libs/analytics'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { Properties } from 'libs/place/types'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const QUERY_ADDRESS = '1 rue Poissonnière'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SetAddress/>', () => {
  beforeEach(() => {
    mockServer.universalGet<FeatureCollection<Point, Properties>>(
      'https://api-adresse.data.gouv.fr/search',
      mockedSuggestedPlaces
    )
    mockServer.getApi<SettingsResponse>('/v1/settings', defaultSettings)
  })

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

  it('should navigate to SetStatus when clicking on "Continuer"', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await screen.findByText(mockedSuggestedPlaces.features[1].properties.label)
    fireEvent.press(screen.getByText(mockedSuggestedPlaces.features[1].properties.label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetStatus')
    })
  })

  it('should save address in local storage when clicking on "Continuer"', async () => {
    renderSetAddress()

    const input = screen.getByPlaceholderText('Ex\u00a0: 34 avenue de l’Opéra')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await screen.findByText(mockedSuggestedPlaces.features[1].properties.label)
    fireEvent.press(screen.getByText(mockedSuggestedPlaces.features[1].properties.label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(async () => {
      expect(await storage.readObject('profile-address')).toMatchObject({
        state: {
          address: mockedSuggestedPlaces.features[1].properties.label,
        },
      })
    })
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
