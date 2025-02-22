import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { requestGeolocPermission, showGeolocPermissionModal } from 'libs/location/__mocks__'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/location')
const mockUseLocation = useLocation as jest.Mock

describe('<GeolocationBanner />', () => {
  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
    })

    it('should display system banner for geolocation incitation', () => {
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
        showGeolocPermissionModal,
      })
      render(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )

      expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
    })
  })

  describe('When wipAppV2SystemBlock feature flag deactivated', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should display generic banner for geolocation incitation', () => {
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
        showGeolocPermissionModal,
      })
      render(
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="Pour trouver des offres autour de toi."
          analyticsFrom="thematicHome"
        />
      )

      expect(screen.getByTestId('genericBanner')).toBeOnTheScreen()
    })
  })

  it('should open "Paramètres de localisation" modal when pressing button and permission is never ask again', () => {
    mockUseLocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
      showGeolocPermissionModal,
    })
    render(
      <GeolocationBanner
        title="Géolocalise-toi"
        subtitle="Pour trouver des offres autour de toi."
        analyticsFrom="thematicHome"
      />
    )
    const button = screen.getByText('Géolocalise-toi')

    fireEvent.press(button)

    expect(showGeolocPermissionModal).toHaveBeenCalledWith()
  })

  it('should ask for permission when pressing button and permission is denied', () => {
    mockUseLocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.DENIED,
      requestGeolocPermission,
    })
    render(
      <GeolocationBanner
        title="Géolocalise-toi"
        subtitle="Pour trouver des offres autour de toi."
        analyticsFrom="thematicHome"
      />
    )
    const button = screen.getByText('Géolocalise-toi')

    fireEvent.press(button)

    expect(requestGeolocPermission).toHaveBeenCalledWith()
  })

  it('should call onPress externaly when specified', () => {
    const mockOnPress = jest.fn()
    render(
      <GeolocationBanner
        title="Géolocalise-toi"
        subtitle="Pour trouver des offres autour de toi."
        analyticsFrom="thematicHome"
        onPress={mockOnPress}
      />
    )

    const button = screen.getByText('Géolocalise-toi')

    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})
