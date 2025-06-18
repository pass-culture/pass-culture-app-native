import { StackScreenProps } from '@react-navigation/stack'
import { FeatureCollection, Point } from 'geojson'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
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
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    await screen.findByText('Recherche et sélectionne ton adresse')

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    expect(await screen.findByText('Profil')).toBeTruthy()
    expect(await screen.findByText('Quelle est ton adresse\u00a0?')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    renderSetAddress({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
    expect(await screen.findByText('Saisis ton adresse postale')).toBeTruthy()
  })

  it('should display a list of addresses when user add an address', async () => {
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(screen.getByText(mockedSuggestedPlaces.features[0].properties.label)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[1].properties.label)).toBeOnTheScreen()
      expect(screen.getByText(mockedSuggestedPlaces.features[2].properties.label)).toBeOnTheScreen()
    })
  })

  it('should navigate to SetStatus when clicking on "Continuer"', async () => {
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.label))
    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetStatus', {
      type: ProfileTypes.IDENTITY_CHECK,
    })
  })

  it('should save address in local storage when clicking on "Continuer"', async () => {
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.label))
    await user.press(screen.getByText('Continuer'))

    expect(await storage.readObject('profile-address')).toMatchObject({
      state: {
        address: mockedSuggestedPlaces.features[1].properties.label,
      },
    })
  })

  it('should log analytics on press Continuer', async () => {
    renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

    const input = screen.getByTestId('Entrée pour l’adresse')
    fireEvent.changeText(input, QUERY_ADDRESS)

    await user.press(screen.getByText('Continuer'))

    expect(analytics.logSetAddressClicked).toHaveBeenCalledTimes(1)
  })
})

const renderSetAddress = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetAddress'
  >
  return render(
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress {...navProps} />
      </SettingsWrapper>
    )
  )
}
