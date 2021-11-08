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

const MOCK_POSITION = { latitude: 90, longitude: 90 }

describe('useGeolocation()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetPositionSuccess()
  })
  afterAll(jest.clearAllMocks)

  it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns GRANTED', async () => {
    mockPermissionResult(GeolocPermissionState.GRANTED)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
      expect(result.current.position).toBe(MOCK_POSITION)
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
      expect(result.current.position).toBe(null)
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
      expect(result.current.position).toBe(null)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
    })
  })

  it('should call onSubmit() and onAcceptance() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is not null', async () => {
    mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.GRANTED)
      expect(result.current.position).toBe(MOCK_POSITION)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).not.toBeCalled()
      expect(onAcceptance).toBeCalled()
    })
  })

  it('should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is null', async () => {
    mockGetPositionFail()
    mockPermissionResult(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
    const { result } = renderGeolocationHook()
    result.current.requestGeolocPermission({ onSubmit, onAcceptance, onRefusal })

    await waitForExpect(() => {
      expect(result.current.permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
      expect(result.current.position).toBe(null)
      expect(onSubmit).toBeCalled()
      expect(onRefusal).toBeCalled()
      expect(onAcceptance).not.toBeCalled()
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
      renderGeolocationHook()
      await waitForExpect(() => {
        if (statement === 'call') expect(mockGetPosition).toBeCalled()
        else expect(mockGetPosition).not.toBeCalled()
      })
    }
  )
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

function renderGeolocationHook() {
  return renderHook(useGeolocation, { wrapper: GeolocationWrapper })
}
