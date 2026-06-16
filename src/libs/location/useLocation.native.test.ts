import { act } from 'react'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { requestGeolocPermission, initLocationPermission } from 'libs/locationV2/location.methods'
import { renderHook, waitFor } from 'tests/utils'

import { GeolocPermissionState } from './geolocation/enums'
import { useLocation } from './useLocation'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')

const getGeolocPositionMock = jest.mocked(getGeolocPosition)
const mockCheckGeolocPermission = jest.mocked(checkGeolocPermission)
const mockRequestOSGeolocPermission = jest.mocked(requestOSGeolocPermission)
function mockPermissionResult(state: GeolocPermissionState) {
  mockCheckGeolocPermission.mockResolvedValue(state)
  mockRequestOSGeolocPermission.mockResolvedValue(state)
}

const onSubmit = jest.fn()
const onAcceptance = jest.fn()
const onRefusal = jest.fn()

const MOCK_POSITION = { latitude: 90, longitude: 90 }

describe('useLocation()', () => {
  describe('requestGeolocPermission()', () => {
    beforeEach(() => {
      mockGetGeolocPositionSuccess()
    })

    it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns GRANTED', async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)
      const { result } = renderUseLocation()
      await act(async () => {
        await requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })
      })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
        expect(result.current.geolocPosition).toBe(MOCK_POSITION)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).not.toHaveBeenCalled()
        expect(onAcceptance).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns DENIED', async () => {
      mockPermissionResult(GeolocPermissionState.DENIED)
      const { result } = renderUseLocation()
      await act(async () => {
        await requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })
      })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.DENIED)
        expect(result.current.geolocPosition).toBe(null)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).toHaveBeenCalledTimes(1)
        expect(onAcceptance).not.toHaveBeenCalled()
      })
    })

    it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEVER_ASK_AGAIN', async () => {
      mockPermissionResult(GeolocPermissionState.NEVER_ASK_AGAIN)
      const { result } = renderUseLocation()
      await act(async () => {
        await requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })
      })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
        expect(result.current.geolocPosition).toBe(null)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).toHaveBeenCalledTimes(1)
        expect(onAcceptance).not.toHaveBeenCalled()
      })
    })

    it(`should call getGeolocPosition() when permission is ${GeolocPermissionState.GRANTED}`, async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)

      await act(async () => {
        initLocationPermission()
      })
      renderUseLocation()

      await waitFor(() => {
        expect(getGeolocPositionMock).toHaveBeenCalledTimes(1)
      })
    })

    it.each`
      permission
      ${GeolocPermissionState.DENIED}
      ${GeolocPermissionState.NEVER_ASK_AGAIN}
    `(
      'should not call getGeolocPosition() when permission is $permission',
      async (params: { permission: GeolocPermissionState }) => {
        const { permission } = params
        mockPermissionResult(permission)

        await act(async () => {
          initLocationPermission()
        })

        renderUseLocation()

        await waitFor(() => {
          expect(getGeolocPositionMock).not.toHaveBeenCalled()
        })
      }
    )
  })
})

const mockGetGeolocPositionSuccess = () => {
  getGeolocPositionMock.mockResolvedValue(MOCK_POSITION)
}

const renderUseLocation = () => {
  return renderHook(useLocation)
}
