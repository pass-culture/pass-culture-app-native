import React from 'react'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { requestGeolocPermission, showGeolocPermissionModal } from 'libs/location/__mocks__'
import { fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

jest.mock('libs/location')
const mockUseGeolocation = useLocation as jest.Mock

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<GeolocationBanner />', () => {
  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should display system banner for geolocation incitation', () => {
      mockUseGeolocation.mockReturnValueOnce({
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
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should display generic banner for geolocation incitation', () => {
      mockUseGeolocation.mockReturnValueOnce({
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
    mockUseGeolocation.mockReturnValueOnce({
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
    mockUseGeolocation.mockReturnValueOnce({
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
