import { checkGeolocPermission } from 'libs/geolocation/checkGeolocPermission'
import { requestGeolocPermission } from 'libs/geolocation/requestGeolocPermission'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

import { GeolocPermissionState, GeolocPositionError } from './enums'
import { getPosition } from './getPosition'
import { LocationWrapper, useLocation } from './LocationWrapper'
import { GeolocationError } from './types'

const mockGetPosition = jest.mocked(getPosition)
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
      mockGetPositionSuccess()
    })
    it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns GRANTED', async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
        expect(result.current.userPosition).toBe(MOCK_POSITION)
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
        expect(result.current.userPosition).toBe(null)
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
        expect(result.current.userPosition).toBe(null)
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
        expect(result.current.userPosition).toBe(MOCK_POSITION)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).not.toHaveBeenCalled()
        expect(onAcceptance).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is null', async () => {
      mockGetPositionFail()
      mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

      await waitFor(() => {
        expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
        expect(result.current.userPosition).toBe(null)
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onRefusal).toHaveBeenCalledTimes(1)
        expect(onAcceptance).not.toHaveBeenCalled()
      })
    })

    it.each`
      permission                                          | statement
      ${GeolocPermissionState.GRANTED}                    | ${'call'}
      ${GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY} | ${'call'}
      ${GeolocPermissionState.DENIED}                     | ${'not call'}
      ${GeolocPermissionState.NEVER_ASK_AGAIN}            | ${'not call'}
    `(
      'should $statement getPosition() when permission is $permission',
      async (params: { permission: GeolocPermissionState; statement: 'call' | 'not call' }) => {
        const { permission, statement } = params
        mockPermissionResult(permission)
        renderLocationHook()

        await waitFor(() => {
          if (statement === 'call') expect(mockGetPosition).toHaveBeenCalledTimes(1)
          else expect(mockGetPosition).not.toHaveBeenCalled()
        })
      }
    )
  })

  describe('location_type', () => {
    it('should right UserGeolocation in location_type async storage when geolocation is turn on', async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)
      const { result } = renderLocationHook()
      result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })
      await waitFor(() => {
        expect(onAcceptance).toHaveBeenCalledTimes(1)
      })
      const localStorageLocationType = await storage.readString('location_type')
      expect(localStorageLocationType).toEqual('UserGeolocation')
    })

    it('should right UserSpecificLocation in location_type async storage when a customPosition is set ', async () => {
      mockPermissionResult(GeolocPermissionState.DENIED)
      const { result } = renderLocationHook()
      await act(async () => {
        result.current.setCustomPosition({ latitude: 85, longitude: 40 })
      })
      const localStorageLocationType = await storage.readString('location_type')
      expect(localStorageLocationType).toEqual('UserSpecificLocation')
    })

    it('should right UserSpecificLocation in location_type async storage when a customPosition is set even if geolocation is activate ', async () => {
      mockPermissionResult(GeolocPermissionState.GRANTED)
      const { result } = renderLocationHook()
      await act(async () => {
        result.current.setCustomPosition({ latitude: 85, longitude: 40 })
      })
      const localStorageLocationType = await storage.readString('location_type')
      expect(localStorageLocationType).toEqual('UserSpecificLocation')
    })

    it('should right Undefined in location_type async storage when neither customPosition and userPosition are set', async () => {
      mockPermissionResult(GeolocPermissionState.DENIED)
      const { result } = renderLocationHook()
      await act(async () => {
        result.current.setCustomPosition(null)
      })
      const localStorageLocationType = await storage.readString('location_type')
      expect(localStorageLocationType).toEqual('Undefined')
    })
  })
})

function mockGetPositionSuccess() {
  mockGetPosition.mockResolvedValue(MOCK_POSITION)
}

function mockGetPositionFail() {
  mockGetPosition.mockRejectedValue({
    type: GeolocPositionError.POSITION_UNAVAILABLE,
    message: 'error message',
  } as GeolocationError)
}

function renderLocationHook() {
  return renderHook(useLocation, { wrapper: LocationWrapper })
}
