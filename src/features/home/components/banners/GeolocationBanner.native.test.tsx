import React from 'react'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { showGeolocPermissionModal, requestGeolocPermission } from 'libs/geolocation/__mocks__'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/geolocation')
const mockUseGeolocation = useGeolocation as jest.Mock

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
})
