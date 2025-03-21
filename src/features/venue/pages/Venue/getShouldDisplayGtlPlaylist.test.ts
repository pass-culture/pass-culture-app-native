import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'

describe('getShouldDisplayGtlPlaylist', () => {
  it.each`
    venueType                              | expectedResult
    ${VenueTypeCodeKey.BOOKSTORE}          | ${true}
    ${VenueTypeCodeKey.DISTRIBUTION_STORE} | ${true}
    ${VenueTypeCodeKey.RECORD_STORE}       | ${true}
    ${VenueTypeCodeKey.CULTURAL_CENTRE}    | ${false}
    ${null}                                | ${false}
    ${undefined}                           | ${false}
  `(
    'should return $expectedResult when venueType is $venueType',
    async ({ venueType, expectedResult }) => {
      const result = getShouldDisplayGtlPlaylist({ venueType })

      expect(result).toBe(expectedResult)
    }
  )

  it.each`
    searchGroup                                         | expectedResult
    ${SearchGroupNameEnumv2.LIVRES}                     | ${true}
    ${SearchGroupNameEnumv2.MUSIQUE}                    | ${true}
    ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES} | ${false}
    ${null}                                             | ${false}
    ${undefined}                                        | ${false}
  `(
    'should return $expectedResult when searchGroup is $searchGroup',
    async ({ searchGroup, expectedResult }) => {
      const result = getShouldDisplayGtlPlaylist({ searchGroup })

      expect(result).toBe(expectedResult)
    }
  )
})
