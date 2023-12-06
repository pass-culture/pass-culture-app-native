import React from 'react'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { showGeolocPermissionModal, requestGeolocPermission } from 'libs/location/__mocks__'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/geolocation')
const mockUseGeolocation = useLocation as jest.Mock

describe('<GeolocationBanner />', () => {
  it('should open "Paramètres de localisation" modal when pressing button and permission is never ask again', () => {
    mockUseGeolocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
      showGeolocPermissionModal,
    })
    render(
      <GeolocationBanner
        title="Géolocalise-toi"
        subtitle="Pour trouver des offres autour de toi."
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
        onPress={mockOnPress}
      />
    )

    const button = screen.getByText('Géolocalise-toi')

    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})
