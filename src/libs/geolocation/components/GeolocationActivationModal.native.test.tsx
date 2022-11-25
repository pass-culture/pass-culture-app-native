import React from 'react'

import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { fireEvent, render } from 'tests/utils'

const hideGeolocPermissionModal = jest.fn()
const onPressGeolocPermissionModalButton = jest.fn()

let mockPermissionState = GeolocPermissionState.GRANTED
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
  }),
}))

describe('GeolocationActivationModal', () => {
  it('should render properly', () => {
    mockPermissionState = GeolocPermissionState.DENIED
    const renderAPI = render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should open settings to activate geoloc and log event deeplinkEnableLocation', () => {
    mockPermissionState = GeolocPermissionState.DENIED
    const renderAPI = render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    fireEvent.press(renderAPI.getByText('Activer la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toBeCalled()
  })

  it('should open settings to deactivate geoloc and log event deeplinkEnableLocation', () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    const renderAPI = render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    fireEvent.press(renderAPI.getByText('Désactiver la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toBeCalled()
  })
})
