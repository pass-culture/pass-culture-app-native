import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { analytics } from 'libs/analytics'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'

describe('GeolocationActivationModal', () => {
  it('should open settings and log event deeplinkEnableLocation', () => {
    const hideGeolocPermissionModal = jest.fn()
    const onPressGeolocPermissionModalButton = jest.fn()
    const renderAPI = render(
      <GeolocationActivationModal
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        isGeolocPermissionModalVisible={true}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    )

    fireEvent.press(renderAPI.getByText('Activer la géolocalisation'))

    expect(analytics.logOpenLocationSettings).toBeCalled()
    expect(onPressGeolocPermissionModalButton).toBeCalled()
    expect(hideGeolocPermissionModal).not.toBeCalled()
  })
})
