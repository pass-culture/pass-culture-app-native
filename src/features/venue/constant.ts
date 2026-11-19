import { Activity } from 'api/gen'
import { VenueSurveyConfig, VenueSurveyKey } from 'features/venue/types'

export const VENUE_SURVEY_MAPPING = {
  BOOKSHOP_AND_LIBRARY: {
    url: 'https://passculture.qualtrics.com/jfe/form/SV_eVFob8fL2Qpd5ga',
    activities: [Activity.BOOKSTORE, Activity.LIBRARY],
    descriptionEnd: 'de lecture',
  },
  DISTRIBUTION: {
    url: 'https://passculture.qualtrics.com/jfe/form/SV_7U4ocoxSFH3XCfQ',
    activities: [
      Activity.CREATIVE_ARTS_STORE,
      Activity.DISTRIBUTION_STORE,
      Activity.MUSIC_INSTRUMENT_STORE,
      Activity.RECORD_STORE,
    ],
    descriptionEnd: 'd‘achat',
  },
  OUTINGS_AND_OTHERS: {
    url: 'https://passculture.qualtrics.com/jfe/form/SV_5BTLjkZmfGMtdMW',
    activities: [
      Activity.ART_GALLERY,
      Activity.ARTS_CENTRE,
      Activity.CINEMA,
      Activity.COMMUNITY_CENTRE,
      Activity.CULTURAL_CENTRE,
      Activity.FESTIVAL,
      Activity.HERITAGE_SITE,
      Activity.MUSEUM,
      Activity.OTHER,
      Activity.PERFORMANCE_HALL,
      Activity.TOURIST_INFORMATION_CENTRE,
    ],
    descriptionEnd: 'de sortie',
  },
} satisfies Record<VenueSurveyKey, VenueSurveyConfig>
