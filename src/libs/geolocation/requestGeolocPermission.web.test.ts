import { MockedFunction } from 'ts-jest/dist/utils/testing'

import { GeolocPermissionState } from './enums'
import { requestGeolocPermission } from './requestGeolocPermission.web'

const mockQuery = navigator.permissions.query as MockedFunction<typeof navigator.permissions.query>
const mockGetCurrentPosition = navigator.geolocation.getCurrentPosition as MockedFunction<
  typeof navigator.geolocation.getCurrentPosition
>

describe('requestGeolocPermission web', () => {
  afterEach(jest.clearAllMocks)

  it('should return GRANTED if web permission is "granted"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'granted' } as PermissionStatus)
    const state = await requestGeolocPermission()
    expect(state).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return NEVER_ASK_AGAIN if web permission is "denied"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'denied' } as PermissionStatus)
    const state = await requestGeolocPermission()
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })

  it('should return GRANTED if web permission is "prompt" and getCurrentPosition() executes its successCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPosition.mockImplementationOnce((successCallback) =>
      Promise.resolve(
        successCallback({ coords: { latitude: 48.85, longitude: 2.29 } } as GeolocationPosition)
      )
    )
    const state = await requestGeolocPermission()
    expect(state).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return NEVER_ASK_AGAIN if web permission is "prompt" and getCurrentPosition() executes its errorCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPosition.mockImplementationOnce((_successCallback, errorCallback) => {
      if (!errorCallback) return Promise.resolve(undefined)
      return Promise.resolve(
        errorCallback({
          code: GeolocationPositionError.POSITION_UNAVAILABLE,
          message: '',
        } as GeolocationPositionError)
      )
    })
    const state = await requestGeolocPermission()
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })

  it('should return NEVER_ASK_AGAIN if web permission is something else', async () => {
    // @ts-ignore : we purposely return an "impossible value" for the sake of the test
    mockQuery.mockResolvedValueOnce({ state: 'something else' })
    const state = await requestGeolocPermission()
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
