import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { GeolocationWrapper, useGeolocation, requestGeolocPermission } from 'libs/geolocation'

import { GeolocPermissionState } from './permissionState.d'

const mockRequestGeolocPermission = requestGeolocPermission as jest.Mock

jest.mock('libs/geolocation/requestGeolocPermission', () => ({
  requestGeolocPermission: jest.fn(() => 'granted'),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

const onSubmit = jest.fn()
const onAcceptance = jest.fn()
const onRefusal = jest.fn()

describe('useGeolocation()', () => {
  Platform.OS = 'android'
  it('should call onAcceptance when requestGeolocPermission returns access is granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('granted')
    const { result } = renderGeolocationHook()

    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitFor(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
      expect(onSubmit).toBeCalled()
      expect(onAcceptance).toBeCalled()
      expect(onRefusal).not.toBeCalled()
    })
  })

  it('should call onRefusal when requestGeolocPermission returns access is denied', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    mockRequestGeolocPermission.mockImplementationOnce(() => 'denied')
    const { result } = renderGeolocationHook()

    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitFor(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.DENIED)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call onRefusal when requestGeolocPermission returns access is never_ask_again', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    mockRequestGeolocPermission.mockImplementationOnce(() => 'never_ask_again')
    const { result } = renderGeolocationHook()

    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitFor(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })
})

function renderGeolocationHook() {
  const wrapper = (props: { children: Element }) => (
    <GeolocationWrapper>{props.children}</GeolocationWrapper>
  )
  return renderHook(useGeolocation, { wrapper })
}
