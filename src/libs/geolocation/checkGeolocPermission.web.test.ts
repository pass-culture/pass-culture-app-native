import { checkGeolocPermission } from './checkGeolocPermission'
import { GeolocPermissionState } from './enums'

jest.mock('libs/geolocation/checkGeolocPermission', () =>
  jest.requireActual('./checkGeolocPermission')
)

let mockQuery = jest.mocked(navigator.permissions.query)
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

describe('checkGeolocPermission()', () => {
  afterEach(resetNavigatorPermissions)

  it.each`
    permissionStatus                            | expectedState                                       | isPermissionAPIUndefined
    ${{ state: 'granted' } as PermissionStatus} | ${GeolocPermissionState.GRANTED}                    | ${false}
    ${{ state: 'denied' } as PermissionStatus}  | ${GeolocPermissionState.NEVER_ASK_AGAIN}            | ${false}
    ${{ state: 'prompt' } as PermissionStatus}  | ${GeolocPermissionState.DENIED}                     | ${false}
    ${undefined}                                | ${GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY} | ${true}
  `(
    'should return $expectedState when permissionStatus=$permissionStatus and isPermissionAPIUndefined=$isPermissionAPIUndefined',
    async ({
      permissionStatus,
      expectedState,
      isPermissionAPIUndefined,
    }: {
      permissionStatus: PermissionStatus
      expectedState: GeolocPermissionState
      isPermissionAPIUndefined: boolean
    }) => {
      if (isPermissionAPIUndefined) mockNavigatorPermissionsUndefined()
      mockQuery.mockResolvedValueOnce(permissionStatus)
      const state = await checkGeolocPermission()
      if (isPermissionAPIUndefined) expect(mockQuery).not.toBeCalled()
      else expect(mockQuery).toBeCalledTimes(1)
      expect(state).toEqual(expectedState)
    }
  )
})
