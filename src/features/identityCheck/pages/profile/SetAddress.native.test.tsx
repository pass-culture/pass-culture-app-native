import { FeatureCollection, Point } from 'geojson'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { Properties } from 'libs/place/types'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
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

const user = userEvent.setup()
jest.useFakeTimers()

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetAddress/>', () => {
  beforeEach(() => {
    mockServer.universalGet<FeatureCollection<Point, Properties>>(
      'https://data.geopf.fr/geocodage/search',
      mockedSuggestedPlaces
    )
    mockServer.getApi<SettingsResponse>('/v1/settings', defaultSettings)
  })

  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it('should render correctly', async () => {
    renderSetAddress()

    await screen.findByTestId('Entrée pour l’adresse')

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetAddress()

    expect(await screen.findByText('Profil')).toBeTruthy()
    expect(await screen.findByText('Quelle est ton adresse\u00a0?')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    })
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    }) // re-render
    renderSetAddress()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
    expect(await screen.findByText('Saisis ton adresse postale')).toBeTruthy()
  })

  it('should display a list of addresses when user add an address', async () => {
    renderSetAddress()

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedPlaces.features[0].properties.name)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[1].properties.name)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[2].properties.name)).toBeOnTheScreen()
    })
  })

  it('should navigate to SetStatus when clicking on "Continuer"', async () => {
    renderSetAddress()

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SubscriptionStackNavigator', {
      params: {
        type: 'identityCheck',
      },
      screen: 'SetStatus',
    })
  })

  it('should save address in local storage when clicking on "Continuer"', async () => {
    renderSetAddress()

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
    await user.press(screen.getByText('Continuer'))

    expect(await storage.readObject('profile-address')).toMatchObject({
      state: {
        address: mockedSuggestedPlaces.features[1].properties.name,
      },
    })
  })
})

const renderSetAddress = () => {
  return render(
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress />
      </SettingsWrapper>
    )
  )
}
