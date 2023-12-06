import React from 'react'

import { analytics } from 'libs/analytics'
import { GeolocPermissionState } from 'libs/location'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { fireEvent, render, screen } from 'tests/utils'

const hideGeolocPermissionModal = jest.fn()
const onPressGeolocPermissionModalButton = jest.fn()

let mockPermissionState = GeolocPermissionState.GRANTED
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    permissionState: mockPermissionState,
  }),
}))

describe('GeolocationActivationModal', () => {
  it('should render properly', () => {
    mockPermissionState = GeolocPermissionState.DENIED
    render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should open settings to activate geoloc and log event deeplinkEnableLocation', () => {
    mockPermissionState = GeolocPermissionState.DENIED
    render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    fireEvent.press(screen.getByText('Activer la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toHaveBeenCalled()
  })

  it('should open settings to deactivate geoloc and log event deeplinkEnableLocation', () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    fireEvent.press(screen.getByText('Désactiver la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toHaveBeenCalled()
  })
})
