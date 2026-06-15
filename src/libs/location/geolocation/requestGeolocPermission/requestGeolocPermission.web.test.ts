import { GeolocPermissionState } from '../enums'

import { requestGeolocPermission } from './requestGeolocPermission'

const mockQuery = jest.mocked(navigator.permissions.query)
const mockGetCurrentPosition = jest.mocked(navigator.geolocation.getCurrentPosition)

describe('requestGeolocPermission()', () => {
  it('should return GRANTED if web permission is "granted"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'granted' } as PermissionStatus)
    const state = await requestGeolocPermission()

    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return NEVER_ASK_AGAIN if web permission is "denied"', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'denied' } as PermissionStatus)
    const state = await requestGeolocPermission()

    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })

  it('should return DENIED if web permission is "prompt" and getCurrentPosition() executes its errorCallback', async () => {
    mockQuery.mockResolvedValueOnce({ state: 'prompt' } as PermissionStatus)
    mockGetCurrentPositionError()
    const state = await requestGeolocPermission()

    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(state).toEqual(GeolocPermissionState.DENIED)
  })
})

function mockGetCurrentPositionError() {
  mockGetCurrentPosition.mockImplementationOnce((_successCallback, errorCallback) => {
    if (!errorCallback) return Promise.resolve(undefined)
    return Promise.resolve(
      // @ts-expect-error: object passed as param matches the type GeolocationPositioError
      errorCallback({ code: 1, message: '' })
    )
  })
}
