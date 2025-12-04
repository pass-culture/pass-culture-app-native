import { Activity, SearchGroupNameEnumv2 } from 'api/gen'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'

describe('getShouldDisplayGtlPlaylist', () => {
  it.each`
    activity                       | expectedResult
    ${Activity.BOOKSTORE}          | ${true}
    ${Activity.DISTRIBUTION_STORE} | ${true}
    ${Activity.RECORD_STORE}       | ${true}
    ${Activity.CULTURAL_CENTRE}    | ${false}
    ${null}                        | ${false}
    ${undefined}                   | ${false}
  `(
    'should return $expectedResult when activity is $activity',
    async ({ activity, expectedResult }) => {
      const result = getShouldDisplayGtlPlaylist({ activity })

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
