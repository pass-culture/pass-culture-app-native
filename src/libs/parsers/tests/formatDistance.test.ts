import { EiffelTourCoordinates } from 'libs/geolocation/tests.utils'

import { getHumanizeRelativeDistance, formatDistance } from '../formatDistance'

// Distance using https://www.sunearthtools.com/fr/tools/distance.php
// Center (EiffelTourCoordinates): {latitude: 48.85, longitude: 2.29 }

describe('formatDistance', () => {
  it.each`
    lat      | lng       | actualDistance | expected
    ${48.85} | ${2.2901} | ${7.3}         | ${'7 m'}
    ${48.85} | ${2.2902} | ${14.6}        | ${'15 m'}
    ${48.85} | ${2.291}  | ${73.2}        | ${'75 m'}
    ${48.85} | ${2.292}  | ${146.4}       | ${'150 m'}
    ${48.85} | ${2.33}   | ${2.9276}      | ${'2,9 km'}
    ${48.85} | ${2.39}   | ${7.3191}      | ${'7 km'}
    ${48.85} | ${102.39} | ${6739.1826}   | ${'900+ km'}
  `('getHumanizeRelativeDistance($actualDistance) \t= $expected', ({ lat, lng, expected }) => {
    expect(
      getHumanizeRelativeDistance(
        lat,
        lng,
        EiffelTourCoordinates.latitude,
        EiffelTourCoordinates.longitude
      )
    ).toBe(expected)
  })

  it("should return undefined if we can't have the user's position", () => {
    const coords = { lat: 48.85, lng: 2.29 }
    const position = null

    expect(formatDistance(coords, position)).toBeUndefined()
  })
})
