import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import * as permissions from 'react-native-permissions'

import { GeolocationWrapper, GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { waitFor } from 'tests/utils'

import { getPosition } from './getPosition'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.mock('./getPosition', () => ({
  getPosition: jest.fn(),
}))

const onSubmit = jest.fn()
const onAcceptance = jest.fn()
const onRefusal = jest.fn()

describe('useGeolocation()', () => {
  Platform.OS = 'ios'
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
    jest.spyOn(permissions, 'check').mockResolvedValueOnce('denied')
    const { result } = renderGeolocationHook()

    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitFor(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call onRefusal when requestGeolocPermission returns access is blocked', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('restricted')
    jest.spyOn(permissions, 'check').mockResolvedValueOnce('blocked')
    const { result } = renderGeolocationHook()

    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitFor(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should set position when permission is granted', async () => {
    jest.spyOn(permissions, 'check').mockResolvedValueOnce('granted')
    renderGeolocationHook()

    await waitFor(() => {
      expect(getPosition).toHaveBeenCalled()
    })
  })

  it('should not set position when permission is denied', async () => {
    jest.spyOn(permissions, 'check').mockResolvedValueOnce('denied')
    renderGeolocationHook()

    await waitFor(() => {
      expect(getPosition).not.toHaveBeenCalled()
    })
  })

  it('should not set position when permission is blocked', async () => {
    jest.spyOn(permissions, 'check').mockResolvedValueOnce('blocked')
    renderGeolocationHook()

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
