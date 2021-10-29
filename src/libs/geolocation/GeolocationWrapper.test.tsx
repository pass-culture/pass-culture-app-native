/* eslint-disable local-rules/independant-mocks */
import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { checkGeolocPermission } from 'libs/geolocation/checkGeolocPermission'
import { requestGeolocPermission } from 'libs/geolocation/requestGeolocPermission'

import { GeolocPermissionState, GeolocPositionError } from './enums'
import { GeolocationWrapper, useGeolocation } from './GeolocationWrapper'
import { getPosition } from './getPosition'
import { GeolocationError } from './types'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

const mockGetPosition = mocked(getPosition)
const mockCheckGeolocPermission = mocked(checkGeolocPermission)
const mockRequestGeolocPermission = mocked(requestGeolocPermission)
function mockPermissionResult(state: GeolocPermissionState) {
  mockCheckGeolocPermission.mockResolvedValue(state)
  mockRequestGeolocPermission.mockResolvedValue(state)
}

const onSubmit = jest.fn()
const onAcceptance = jest.fn()
const onRefusal = jest.fn()

beforeEach(jest.clearAllMocks)
afterAll(jest.clearAllMocks)

describe('useGeolocation()', () => {
  it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns GRANTED', async () => {
    mockPermissionResult(GeolocPermissionState.GRANTED)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).not.toBeCalled()
      expect(onAcceptance).toBeCalled()
    })
  })

  it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns DENIED', async () => {
    mockPermissionResult(GeolocPermissionState.DENIED)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.DENIED)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEVER_ASK_AGAIN', async () => {
    mockPermissionResult(GeolocPermissionState.NEVER_ASK_AGAIN)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is not null', async () => {
    mockGetPosition.mockResolvedValue({ latitude: 90, longitude: 90 })
    mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).not.toBeCalled()
      expect(onAcceptance).toBeCalled()
    })
  })

  it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is null', async () => {
    mockGetPosition.mockRejectedValue({
      type: GeolocPositionError.POSITION_UNAVAILABLE,
      message: 'error message',
    } as GeolocationError)
    mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call getPosition() when permission is GRANTED', async () => {
    mockPermissionResult(GeolocPermissionState.GRANTED)
    renderGeolocationHook()
    await waitForExpect(() => {
      expect(mockGetPosition).toBeCalled()
    })
  })

  it('should not call getPosition() when permission is NEVER_ASK_AGAIN', async () => {
    mockPermissionResult(GeolocPermissionState.NEVER_ASK_AGAIN)
    renderGeolocationHook()
    await waitForExpect(() => {
      expect(mockGetPosition).not.toBeCalled()
    })
  })
})

function renderGeolocationHook() {
  return renderHook(useGeolocation, { wrapper: GeolocationWrapper })
}
