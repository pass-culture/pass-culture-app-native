import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { getVenueTypesFromSearchGroup } from 'features/search/helpers/getVenueTypesFromSearchGroup/getVenueTypesFromSearchGroup'

describe('getVenueTypesFromSearchGroup', () => {
  it('should return venue types for LIVRES search group', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.LIVRES)).toEqual([
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.DISTRIBUTION_STORE,
      VenueTypeCodeKey.LIBRARY,
    ])
  })

  it('should return venue types for CINEMA search group', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.CINEMA)).toEqual([
      VenueTypeCodeKey.MOVIE,
    ])
  })

  it('should return venue types for FILMS_DOCUMENTAIRES_SERIES search group', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES)).toEqual([
      VenueTypeCodeKey.DISTRIBUTION_STORE,
    ])
  })

  it('should return venue types for MUSIQUE search group', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.MUSIQUE)).toEqual([
      VenueTypeCodeKey.RECORD_STORE,
      VenueTypeCodeKey.DISTRIBUTION_STORE,
      VenueTypeCodeKey.CONCERT_HALL,
      VenueTypeCodeKey.FESTIVAL,
    ])
  })

  it('should return venue types for CONCERTS_FESTIVALS search group', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.CONCERTS_FESTIVALS)).toEqual([
      VenueTypeCodeKey.FESTIVAL,
      VenueTypeCodeKey.CONCERT_HALL,
    ])
  })

  it('should return an empty an empty for a search group not specified in VENUE_TYPES_BY_SEARCH_GROUP', () => {
    expect(getVenueTypesFromSearchGroup(SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS)).toEqual([])
  })
})
