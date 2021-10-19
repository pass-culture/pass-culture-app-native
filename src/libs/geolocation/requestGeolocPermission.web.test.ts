import { MockedFunction } from 'ts-jest/dist/utils/testing'

import { BrowserGeolocPositionError } from 'libs/geolocation/getPosition.web'

import { GeolocPermissionState } from './enums'
import { requestGeolocPermission } from './requestGeolocPermission.web'

let mockQuery = navigator.permissions.query as MockedFunction<typeof navigator.permissions.query>
const mockGetCurrentPosition = navigator.geolocation.getCurrentPosition as MockedFunction<
  typeof navigator.geolocation.getCurrentPosition
>

const initialNavigatorPermissions = { ...navigator.permissions }
function resetNavigatorPermissions() {
  // @ts-expect-error : `permissions` is a read-only property
  global.navigator.permissions = initialNavigatorPermissions
  mockQuery = initialNavigatorPermissions.query as MockedFunction<
    typeof navigator.permissions.query
  >
}
function mockNavigatorPermissionsUndefined() {
  // @ts-expect-error : `permissions` is a read-only property
  global.navigator.permissions = undefined
}

describe('requestGeolocPermission web', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return GRANTED if web permission is "granted"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'granted' } as PermissionStatus)
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return NEVER_ASK_AGAIN if web permission is "denied"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'denied' } as PermissionStatus)
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })

  it('should return GRANTED if web permission is "prompt" and getCurrentPosition() executes its successCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPositionSuccess()
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return GRANTED if navigator.permissions is undefined and getCurrentPosition() executes its successCallback', async () => {
    mockNavigatorPermissionsUndefined()
    mockGetCurrentPositionSuccess()
    const state = await requestGeolocPermission()
    expect(mockQuery).not.toBeCalled()
    expect(state).toEqual(GeolocPermissionState.GRANTED)
    resetNavigatorPermissions()
  })

  it('should return NEVER_ASK_AGAIN if web permission is "prompt" and getCurrentPosition() executes its errorCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPositionError()
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })

  it('should return NEVER_ASK_AGAIN if navigator.permissions is undefined and getCurrentPosition() executes its errorCallback', async () => {
    mockNavigatorPermissionsUndefined()
    mockGetCurrentPositionError()
    const state = await requestGeolocPermission()
    expect(mockQuery).not.toBeCalled()
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
    resetNavigatorPermissions()
  })
})

function mockGetCurrentPositionSuccess() {
  mockGetCurrentPosition.mockImplementationOnce((successCallback) =>
    Promise.resolve(
      successCallback({ coords: { latitude: 48.85, longitude: 2.29 } } as GeolocationPosition)
    )
  )
}

function mockGetCurrentPositionError() {
  mockGetCurrentPosition.mockImplementationOnce((_successCallback, errorCallback) => {
    if (!errorCallback) return Promise.resolve(undefined)
    return Promise.resolve(
      // @ts-expect-error: object passed as param matches the type GeolocationPositioError
      errorCallback({
        code: BrowserGeolocPositionError.POSITION_UNAVAILABLE,
        message: '',
      })
    )
  })
}
