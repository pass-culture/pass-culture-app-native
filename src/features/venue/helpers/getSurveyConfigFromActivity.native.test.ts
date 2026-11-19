import { Activity } from 'api/gen'
import { VENUE_SURVEY_MAPPING } from 'features/venue/constant'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { VenueSurveyKey } from 'features/venue/types'

describe('getSurveyConfigFromActivity', () => {
  it('should return undefined when activity is null', () => {
    expect(getSurveyConfigFromActivity(null)).toBeUndefined()
  })

  describe.each<[Activity, VenueSurveyKey, string]>([
    // BOOKSHOP_AND_LIBRARY
    [Activity.BOOKSTORE, 'BOOKSHOP_AND_LIBRARY', 'de lecture'],
    [Activity.LIBRARY, 'BOOKSHOP_AND_LIBRARY', 'de lecture'],

    // DISTRIBUTION
    [Activity.CREATIVE_ARTS_STORE, 'DISTRIBUTION', 'd‘achat'],
    [Activity.DISTRIBUTION_STORE, 'DISTRIBUTION', 'd‘achat'],
    [Activity.MUSIC_INSTRUMENT_STORE, 'DISTRIBUTION', 'd‘achat'],
    [Activity.RECORD_STORE, 'DISTRIBUTION', 'd‘achat'],

    // OUTINGS_AND_OTHERS
    [Activity.ART_GALLERY, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.ARTS_CENTRE, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.CINEMA, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.COMMUNITY_CENTRE, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.CULTURAL_CENTRE, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.FESTIVAL, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.HERITAGE_SITE, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.MUSEUM, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.OTHER, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.PERFORMANCE_HALL, 'OUTINGS_AND_OTHERS', 'de sortie'],
    [Activity.TOURIST_INFORMATION_CENTRE, 'OUTINGS_AND_OTHERS', 'de sortie'],
  ])('when activity is %s', (activity, expectedKey, expectedDescriptionEnd) => {
    it(`should return ${expectedKey} config with key and description end is "${expectedDescriptionEnd}"`, () => {
      const result = getSurveyConfigFromActivity(activity)

      expect(result).toEqual({
        ...VENUE_SURVEY_MAPPING[expectedKey],
        descriptionEnd: expectedDescriptionEnd,
        key: expectedKey,
      })
    })
  })
})
