import { useShouldDisplayBusinessModule } from 'features/home/components/modules/business/helpers/useShouldDisplayBusinessModule'
import { LocationCircleArea } from 'features/home/types'
import { GeoCoordinates, Position } from 'libs/geolocation'
import { renderHook } from 'tests/utils'

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
  }),
}))

const locationAreaWithUserInside: LocationCircleArea = {
  latitude: 2,
  longitude: 40,
  radius: 50,
}

const locationAreaWithUserOutside: LocationCircleArea = {
  latitude: 4,
  longitude: 42,
  radius: 50,
}

describe('showBusinessModule()', () => {
  afterEach(jest.resetAllMocks)

  it.each`
    targetNotConnectedUsersOnly | connected | moduleLocalization             | showModule
    ${undefined}                | ${true}   | ${undefined}                   | ${true}
    ${undefined}                | ${true}   | ${locationAreaWithUserInside}  | ${true}
    ${undefined}                | ${true}   | ${locationAreaWithUserOutside} | ${false}
    ${undefined}                | ${false}  | ${undefined}                   | ${true}
    ${undefined}                | ${false}  | ${locationAreaWithUserInside}  | ${true}
    ${undefined}                | ${false}  | ${locationAreaWithUserOutside} | ${false}
    ${false}                    | ${true}   | ${undefined}                   | ${true}
    ${false}                    | ${false}  | ${undefined}                   | ${false}
    ${true}                     | ${true}   | ${undefined}                   | ${false}
    ${true}                     | ${false}  | ${undefined}                   | ${true}
  `(
    'With user geolocated : showBusinessModule($targetNotConnectedUsersOnly, $connected, $geoLocation) \t= $showModule',
    ({ targetNotConnectedUsersOnly, connected, moduleLocalization, showModule: expected }) => {
      mockPosition = DEFAULT_POSITION

      const { result } = renderHook(() =>
        useShouldDisplayBusinessModule(targetNotConnectedUsersOnly, connected, moduleLocalization)
      )

      expect(result.current).toBe(expected)
    }
  )

  it.each`
    targetNotConnectedUsersOnly | connected | moduleLocalization             | showModule
    ${undefined}                | ${true}   | ${undefined}                   | ${true}
    ${undefined}                | ${true}   | ${locationAreaWithUserInside}  | ${false}
    ${undefined}                | ${true}   | ${locationAreaWithUserOutside} | ${false}
    ${undefined}                | ${false}  | ${undefined}                   | ${true}
    ${undefined}                | ${false}  | ${locationAreaWithUserInside}  | ${false}
    ${undefined}                | ${false}  | ${locationAreaWithUserOutside} | ${false}
    ${false}                    | ${true}   | ${undefined}                   | ${true}
    ${false}                    | ${false}  | ${undefined}                   | ${false}
    ${true}                     | ${true}   | ${undefined}                   | ${false}
    ${true}                     | ${false}  | ${undefined}                   | ${true}
  `(
    'With user not geolocated :showBusinessModule($targetNotConnectedUsersOnly, $connected, $geoLocation) \t= $showModule',
    ({ targetNotConnectedUsersOnly, connected, moduleLocalization, showModule: expected }) => {
      mockPosition = undefined

      const { result } = renderHook(() =>
        useShouldDisplayBusinessModule(targetNotConnectedUsersOnly, connected, moduleLocalization)
      )

      expect(result.current).toBe(expected)
    }
  )
})
