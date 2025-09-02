import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { GeolocPermissionState } from 'libs/location/location'
import { render, screen, userEvent } from 'tests/utils'

const hideGeolocPermissionModal = jest.fn()
const onPressGeolocPermissionModalButton = jest.fn()

let mockPermissionState = GeolocPermissionState.GRANTED
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    permissionState: mockPermissionState,
  }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('GeolocationActivationModal', () => {
  it('should render properly', () => {
    mockPermissionState = GeolocPermissionState.DENIED
    renderGeolocationActivationModal()

    expect(screen).toMatchSnapshot()
  })

  it('should open settings to activate geoloc when press on "Activer la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.DENIED
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toHaveBeenCalled()
  })

  it('should log event deeplinkEnableLocation when press on "Activer la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.DENIED
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })

  it('should open settings to deactivate geoloc when press on "Désactiver la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Désactiver la géolocalisation'))

    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
    expect(hideGeolocPermissionModal).not.toHaveBeenCalled()
  })

  it('should log event deeplinkEnableLocation when press on "Désactiver la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Désactiver la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })
})

function renderGeolocationActivationModal() {
  render(
    <GeolocationActivationModal
      hideGeolocPermissionModal={hideGeolocPermissionModal}
      isGeolocPermissionModalVisible
      onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
    />
  )
}
