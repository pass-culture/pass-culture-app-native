import { Activity, SearchGroupNameEnumv2 } from 'api/gen'
import { getActivitiesFromSearchGroup } from 'features/search/helpers/getActivitiesFromSearchGroup/getActivitiesFromSearchGroup'

describe('getActivitiesFromSearchGroup', () => {
  it('should return venue types for LIVRES search group', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.LIVRES)).toEqual([
      Activity.BOOKSTORE,
      Activity.DISTRIBUTION_STORE,
      Activity.LIBRARY,
    ])
  })

  it('should return venue types for CINEMA search group', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.CINEMA)).toEqual([Activity.CINEMA])
  })

  it('should return venue types for FILMS_DOCUMENTAIRES_SERIES search group', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES)).toEqual([
      Activity.DISTRIBUTION_STORE,
    ])
  })

  it('should return venue types for MUSIQUE search group', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.MUSIQUE)).toEqual([
      Activity.RECORD_STORE,
      Activity.DISTRIBUTION_STORE,
      Activity.PERFORMANCE_HALL,
      Activity.FESTIVAL,
    ])
  })

  it('should return venue types for CONCERTS_FESTIVALS search group', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.CONCERTS_FESTIVALS)).toEqual([
      Activity.FESTIVAL,
      Activity.PERFORMANCE_HALL,
    ])
  })

  it('should return an empty an empty for a search group not specified in VENUE_TYPES_BY_SEARCH_GROUP', () => {
    expect(getActivitiesFromSearchGroup(SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS)).toEqual([])
  })
})
