import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { GeolocationWrapper, useGeolocation, requestGeolocPermission } from 'libs/geolocation'
import { storage } from 'libs/storage'
import { waitFor } from 'tests/utils'

import { getPosition } from './getPosition'
import { GeolocPermissionState } from './permissionState.d'

const mockRequestGeolocPermission = requestGeolocPermission as jest.Mock

jest.mock('libs/geolocation/requestGeolocPermission', () => ({
  requestGeolocPermission: jest.fn(() => 'granted'),
}))

let mockCheckGeolocPermission = 'granted'
jest.mock('libs/geolocation/checkGeolocPermission', () => ({
  checkGeolocPermission: jest.fn(() => mockCheckGeolocPermission),
}))

let mockReadObject = true
jest.mock('libs/storage', () => ({
  storage: {
    saveObject: jest.fn(),
    readObject: jest.fn(() => Promise.resolve(mockReadObject)),
  },
}))

const mockAndroidPermission = 'granted'
jest.mock('react-native-permissions', () => ({
  checkMultiple: jest.fn(() => ({
    'android.permission.ACCESS_COARSE_LOCATION': mockAndroidPermission,
    'android.permission.ACCESS_FINE_LOCATION': mockAndroidPermission,
  })),
}))

jest.mock('./getPosition', () => ({
  getPosition: jest.fn(),
}))

const onSubmit = jest.fn()
const onAcceptance = jest.fn()
const onRefusal = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

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

  it('should store "has_allowed_geolocation" = TRUE when requestGeolocPermission returns access is granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('granted')
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission()

    await waitFor(() => {
      expect(storage.saveObject).toHaveBeenCalledWith('has_allowed_geolocation', true)
    })
  })

  it('should store "has_allowed_geolocation" = FALSE when requestGeolocPermission returns access is denied', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    mockRequestGeolocPermission.mockImplementationOnce(() => 'denied')
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission()

    await waitFor(() => {
      expect(storage.saveObject).toHaveBeenCalledWith('has_allowed_geolocation', false)
    })
  })

  it('should store "has_allowed_geolocation" = FALSE when requestGeolocPermission returns access is never_ask_again', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    mockRequestGeolocPermission.mockImplementationOnce(() => 'never_ask_again')
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission()

    await waitFor(() => {
      expect(storage.saveObject).toHaveBeenCalledWith('has_allowed_geolocation', false)
    })
  })

  it('should set position when permission is granted and "has_allowed_geolocation" is true', async () => {
    mockReadObject = true
    mockCheckGeolocPermission = 'granted'
    const { result } = renderGeolocationHook()
    result.current.checkGeolocPermission()

    await waitFor(() => {
      expect(getPosition).toHaveBeenCalled()
    })
  })

  it('should not set position when permission is granted and "has_allowed_geolocation" is false', async () => {
    mockReadObject = false
    mockCheckGeolocPermission = 'granted'
    const { result } = renderGeolocationHook()
    result.current.checkGeolocPermission()

    await waitFor(() => {
      expect(getPosition).not.toHaveBeenCalled()
    })
  })

  it('should not set position when permission is denied and "has_allowed_geolocation" is true', async () => {
    mockReadObject = true
    mockCheckGeolocPermission = 'never_ask_again'
    const { result } = renderGeolocationHook()
    result.current.checkGeolocPermission()

    await waitFor(() => {
      expect(getPosition).not.toHaveBeenCalled()
    })
  })
})

function renderGeolocationHook() {
  const wrapper = (props: { children: Element }) => (
    <GeolocationWrapper>{props.children}</GeolocationWrapper>
  )
  return renderHook(useGeolocation, { wrapper })
}
