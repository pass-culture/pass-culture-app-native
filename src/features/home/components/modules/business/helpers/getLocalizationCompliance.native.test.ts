import { getLocalizationCompliance } from 'features/home/components/modules/business/helpers/getLocalizationCompliance'
import { LocationCircleArea } from 'features/home/types'
import { GeoCoordinates, Position } from 'libs/location'

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
const mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/location/LocationWrapper', () => ({
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

describe('getLocalizationCompliance', () => {
  afterEach(jest.resetAllMocks)

  it.each`
    moduleLocationArea             | userPosition    | expected_result
    ${undefined}                   | ${undefined}    | ${true}
    ${undefined}                   | ${mockPosition} | ${true}
    ${locationAreaWithUserInside}  | ${undefined}    | ${false}
    ${locationAreaWithUserInside}  | ${mockPosition} | ${true}
    ${locationAreaWithUserOutside} | ${undefined}    | ${false}
    ${locationAreaWithUserOutside} | ${mockPosition} | ${false}
  `(
    'should replace {email} by $email in $url when necessary',
    ({
      moduleLocationArea,
      userPosition,
      expected_result,
    }: {
      moduleLocationArea: LocationCircleArea
      userPosition: Position
      expected_result: boolean
    }) => {
      expect(getLocalizationCompliance(moduleLocationArea, userPosition)).toEqual(expected_result)
    }
  )
})
