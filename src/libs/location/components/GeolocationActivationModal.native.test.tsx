import React from 'react'
import { Linking } from 'react-native'

import { goBack } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/components/GeolocationActivationModal'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { locationActions } from 'libs/locationV2/location.store'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

describe('GeolocationActivationModal', () => {
  beforeEach(() => {
    locationActions.setPermissionState(GeolocPermissionState.DENIED)
    goBack.mockClear()
  })

  it('should render properly', () => {
    renderGeolocationActivationModal()

    expect(screen).toMatchSnapshot()
  })

  it('should go back when pressing close icon', async () => {
    renderGeolocationActivationModal()

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should go back when permission is granted', () => {
    locationActions.setPermissionState(GeolocPermissionState.GRANTED)

    renderGeolocationActivationModal()

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should open settings to activate geoloc when press on "Activer la géolocalisation"', async () => {
    jest.spyOn(Linking, 'openSettings').mockResolvedValueOnce(undefined as unknown as void)
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(Linking.openSettings).toHaveBeenCalledTimes(1)
    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })
})

function renderGeolocationActivationModal() {
  render(<GeolocationActivationModal />)
}
