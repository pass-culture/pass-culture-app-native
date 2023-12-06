import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

import { GeolocPermissionState, GeolocPositionError } from './geolocation/enums'
import { LocationWrapper, useLocation } from './LocationWrapper'
import { GeolocationError } from './types'

const getGeolocPositionMock = jest.mocked(getGeolocPosition)
const mockCheckGeolocPermission = jest.mocked(checkGeolocPermission)
const mockRequestGeolocPermission = jest.mocked(requestGeolocPermission)
function mockPermissionResult(state: GeolocPermissionState) {
  mockCheckGeolocPermission.mockResolvedValue(state)
  mockRequestGeolocPermission.mockResolvedValue(state)
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
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

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
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

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
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
        expect(result.current.geolocPosition).toBe(null)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).toHaveBeenCalledTimes(1)
        expect(onAcceptance).not.toHaveBeenCalled()
      })
    })

    it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is not null', async () => {
      mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
        expect(result.current.geolocPosition).toBe(MOCK_POSITION)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).not.toHaveBeenCalled()
        expect(onAcceptance).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is null', async () => {
      mockGetGeolocPositionFail()
      mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
        expect(result.current.geolocPosition).toBe(null)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).toHaveBeenCalledTimes(1)
        expect(onAcceptance).not.toHaveBeenCalled()
      })
    })

    it.each`
      permission
      ${GeolocPermissionState.GRANTED}
      ${GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY}
    `(
      'should call getGeolocPosition() when permission is $permission',
      async (params: { permission: GeolocPermissionState }) => {
        const { permission } = params
        mockPermissionResult(permission)
        renderLocationHook()

        await waitFor(() => {
          expect(getGeolocPositionMock).toHaveBeenCalledTimes(1)
        })
      }
    )

    it.each`
      permission
      ${GeolocPermissionState.DENIED}
      ${GeolocPermissionState.NEVER_ASK_AGAIN}
    `(
      'should not call getGeolocPosition() when permission is $permission',
      async (params: { permission: GeolocPermissionState }) => {
        const { permission } = params
        mockPermissionResult(permission)
        renderLocationHook()

        await waitFor(() => {
          expect(getGeolocPositionMock).not.toHaveBeenCalled()
        })
      }
    )
  })

  describe('location_type', () => {
    it('should write UserGeolocation in location_type async storage when geolocation is turned on', async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })
      await waitFor(() => {
        expect(onAcceptance).toHaveBeenCalledTimes(1)
      })
      const localStorageLocationType = await storage.readString('location_type')

      expect(localStorageLocationType).toEqual('UserGeolocation')
    })

    it('should clear location_type async storage when neither place nor geolocPosition are set', async () => {
      mockPermissionResult(GeolocPermissionState.DENIED)
      const { result } = renderLocationHook()
      await act(async () => {
        result.current.setPlace(null)
      })
      const localStorageLocationType = await storage.readString('location_type')

      expect(localStorageLocationType).toEqual(null)
    })
  })
})

function mockGetGeolocPositionSuccess() {
  getGeolocPositionMock.mockResolvedValue(MOCK_POSITION)
}

function mockGetGeolocPositionFail() {
  getGeolocPositionMock.mockRejectedValue({
    type: GeolocPositionError.POSITION_UNAVAILABLE,
    message: 'error message',
  } as GeolocationError)
}

function renderLocationHook() {
  return renderHook(useLocation, { wrapper: LocationWrapper })
}
