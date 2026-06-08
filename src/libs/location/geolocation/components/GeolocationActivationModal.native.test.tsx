import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { GeolocPermissionState } from 'libs/location/location'
import { locationActions } from 'libs/locationV2/location.store'
import { render, screen, userEvent } from 'tests/utils'

const onPressGeolocPermissionModalButton = jest.spyOn(locationActions, 'showPermissionModal')

let mockPermissionState = GeolocPermissionState.GRANTED
jest.mock('libs/location/useLocation', () => ({
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
    locationActions.showPermissionModal()
    renderGeolocationActivationModal()

    expect(screen).toMatchSnapshot()
  })

  it('should open settings to activate geoloc when press on "Activer la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.DENIED
    locationActions.showPermissionModal()
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
  })

  it('should log event deeplinkEnableLocation when press on "Activer la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.DENIED
    locationActions.showPermissionModal()
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })

  it('should open settings to deactivate geoloc when press on "Désactiver la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    locationActions.showPermissionModal()
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Désactiver la géolocalisation'))

    expect(onPressGeolocPermissionModalButton).toHaveBeenCalledTimes(1)
  })

  it('should log event deeplinkEnableLocation when press on "Désactiver la géolocalisation"', async () => {
    mockPermissionState = GeolocPermissionState.GRANTED
    locationActions.showPermissionModal()
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Désactiver la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })
})

function renderGeolocationActivationModal() {
  render(<GeolocationActivationModal />)
}
