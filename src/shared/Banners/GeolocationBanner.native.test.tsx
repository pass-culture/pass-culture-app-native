import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import {
  defaultLocationState,
  locationActions,
  locationSelectors,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
const mockRequestOSGeolocPermission = jest.mocked(requestOSGeolocPermission)

jest.mock('libs/locationV2/syncLocation')

jest.mock('features/navigation/navigationRef', () => ({
  navigationRef: { navigate: jest.fn() },
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<GeolocationBanner />', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
  })

  it('should display system banner for geolocation incitation', () => {
    render(
      reactQueryProviderHOC(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )
    )

    expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
  })

  it('should navigate to "Paramètres de localisation" modal when pressing button and permission is never ask again', async () => {
    mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)

    render(
      reactQueryProviderHOC(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )
    )
    const button = screen.getByText('Géolocalise-toi')

    await user.press(button)

    const { navigationRef } = jest.requireMock('features/navigation/navigationRef') as {
      navigationRef: { navigate: jest.Mock }
    }
    await waitFor(() =>
      expect(navigationRef.navigate).toHaveBeenCalledWith('GeolocationActivationModal')
    )
  })

  it('should ask for permission when pressing button and permission is denied', async () => {
    mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    render(
      reactQueryProviderHOC(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )
    )
    const button = screen.getByText('Géolocalise-toi')

    await user.press(button)

    await waitFor(() =>
      expect(locationSelectors.selectPermissionState()).toBe(GeolocPermissionState.DENIED)
    )
  })

  it('should call onPress externaly when specified', async () => {
    const mockOnPress = jest.fn()
    render(
      reactQueryProviderHOC(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
          onPress={mockOnPress}
        />
      )
    )

    const button = screen.getByText('Géolocalise-toi')

    await user.press(button)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should not display banner when user is geolocated', () => {
    locationActions.setGeolocPosition({ latitude: 2, longitude: 2 })

    render(
      reactQueryProviderHOC(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )
    )

    expect(screen.queryByTestId('systemBanner')).not.toBeOnTheScreen()
  })
})
