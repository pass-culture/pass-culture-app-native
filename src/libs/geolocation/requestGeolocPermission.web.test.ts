import { GeolocPermissionState } from './enums'
import { requestGeolocPermission } from './requestGeolocPermission'

jest.mock('libs/geolocation/requestGeolocPermission', () =>
  jest.requireActual('./requestGeolocPermission')
)

let mockQuery = jest.mocked(navigator.permissions.query)
const mockGetCurrentPosition = jest.mocked(navigator.geolocation.getCurrentPosition)

const initialNavigatorPermissions = { ...navigator.permissions }
function resetNavigatorPermissions() {
  // @ts-expect-error : `permissions` is a read-only property
  global.navigator.permissions = initialNavigatorPermissions
  mockQuery = jest.mocked(initialNavigatorPermissions.query)
}
function mockNavigatorPermissionsUndefined() {
  // @ts-expect-error : `permissions` is a read-only property
  global.navigator.permissions = undefined
}

describe('requestGeolocPermission()', () => {
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

  it('should return NEED_ASK_POSITION_DIRECTLY if web permission is "prompt" and getCurrentPosition() executes its successCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPositionSuccess()
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
  })

  it('should return NEED_ASK_POSITION_DIRECTLY if navigator.permissions is undefined and getCurrentPosition() executes its successCallback', async () => {
    mockNavigatorPermissionsUndefined()
    mockGetCurrentPositionSuccess()
    const state = await requestGeolocPermission()
    expect(mockQuery).not.toBeCalled()
    expect(state).toEqual(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
    resetNavigatorPermissions()
  })

  it('should return NEED_ASK_POSITION_DIRECTLY if web permission is "prompt" and getCurrentPosition() executes its errorCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPositionError()
    const state = await requestGeolocPermission()
    expect(mockQuery).toBeCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
  })

  it('should return NEED_ASK_POSITION_DIRECTLY if navigator.permissions is undefined and getCurrentPosition() executes its errorCallback', async () => {
    mockNavigatorPermissionsUndefined()
    mockGetCurrentPositionError()
    const state = await requestGeolocPermission()
    expect(mockQuery).not.toBeCalled()
    expect(state).toEqual(GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY)
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
      errorCallback({ code: 1, message: '' })
    )
  })
}
