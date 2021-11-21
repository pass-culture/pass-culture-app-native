import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'
import { AppSearchFields } from 'libs/search/filters/constants'

import { buildBoosts } from '../buildBoosts'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const filterEverywhere: LocationFilter = { locationType: LocationType.EVERYWHERE }
const filterAroundUser: LocationFilter = { locationType: LocationType.AROUND_ME, aroundRadius: 20 }
const filterPlace: LocationFilter = {
  locationType: LocationType.PLACE,
  place: Kourou,
  aroundRadius: 20,
}
const filterVenue: LocationFilter = {
  locationType: LocationType.VENUE,
  venue: { ...Kourou, venueId: 4 },
}

const userLocation = { latitude: 48.8557, longitude: 2.3469 }
const expectedBoost = {
  [AppSearchFields.venue_position]: {
    type: 'proximity',
    function: 'exponential',
    center: `48.8557,2.3469`,
    factor: 10,
  },
}

describe('buildBoosts', () => {
  it('should not add a proximity boost if no position', () => {
    expect(buildBoosts(null, filterEverywhere)).toBeUndefined()
    expect(buildBoosts(null, filterAroundUser)).toBeUndefined()
    expect(buildBoosts(null, filterPlace)).toBeUndefined()
    expect(buildBoosts(null, filterVenue)).toBeUndefined()
  })

  it('should not add a proximity boost if no geolocation filter is applied beforehand', () => {
    expect(buildBoosts(userLocation, filterEverywhere)).toBeUndefined()
    expect(buildBoosts(userLocation, filterVenue)).toBeUndefined()
  })

  it("should add a proximity boost centered around the user's position if the search is filtered geographically", () => {
    expect(buildBoosts(userLocation, filterAroundUser)).toStrictEqual(expectedBoost)
    expect(buildBoosts(userLocation, filterPlace)).toStrictEqual(expectedBoost)
  })
})
