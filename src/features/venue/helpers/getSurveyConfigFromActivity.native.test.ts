import { Activity } from 'api/gen'
import { VENUE_SURVEY_MAPPING } from 'features/venue/constant'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { VenueSurveyKey } from 'features/venue/types'

describe('getSurveyConfigFromActivity', () => {
  it('should return undefined when activity is null', () => {
    expect(getSurveyConfigFromActivity(null)).toBeUndefined()
  })

  describe.each<[Activity, VenueSurveyKey]>([
    // BOOKSHOP_AND_LIBRARY
    [Activity.BOOKSTORE, 'BOOKSHOP_AND_LIBRARY'],
    [Activity.LIBRARY, 'BOOKSHOP_AND_LIBRARY'],

    // DISTRIBUTION
    [Activity.CREATIVE_ARTS_STORE, 'DISTRIBUTION'],
    [Activity.DISTRIBUTION_STORE, 'DISTRIBUTION'],
    [Activity.MUSIC_INSTRUMENT_STORE, 'DISTRIBUTION'],
    [Activity.RECORD_STORE, 'DISTRIBUTION'],

    // OUTINGS_AND_OTHERS
    [Activity.ART_GALLERY, 'OUTINGS_AND_OTHERS'],
    [Activity.ARTS_CENTRE, 'OUTINGS_AND_OTHERS'],
    [Activity.CINEMA, 'OUTINGS_AND_OTHERS'],
    [Activity.COMMUNITY_CENTRE, 'OUTINGS_AND_OTHERS'],
    [Activity.CULTURAL_CENTRE, 'OUTINGS_AND_OTHERS'],
    [Activity.FESTIVAL, 'OUTINGS_AND_OTHERS'],
    [Activity.HERITAGE_SITE, 'OUTINGS_AND_OTHERS'],
    [Activity.MUSEUM, 'OUTINGS_AND_OTHERS'],
    [Activity.OTHER, 'OUTINGS_AND_OTHERS'],
    [Activity.PERFORMANCE_HALL, 'OUTINGS_AND_OTHERS'],
    [Activity.TOURIST_INFORMATION_CENTRE, 'OUTINGS_AND_OTHERS'],
  ])('when activity is %s', (activity, expectedKey) => {
    it(`should return the survey configuration for ${expectedKey} with its key`, () => {
      const result = getSurveyConfigFromActivity(activity)

      expect(result).toEqual({
        ...VENUE_SURVEY_MAPPING[expectedKey],
        key: expectedKey,
      })
    })
  })
})
