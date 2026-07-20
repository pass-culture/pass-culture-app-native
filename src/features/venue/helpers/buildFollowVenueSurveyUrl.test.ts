import { Activity } from 'api/gen'
import {
  buildFollowVenueSurveyUrl,
  FOLLOW_VENUE_SURVEY_URL,
} from 'features/venue/helpers/buildFollowVenueSurveyUrl'

describe('buildFollowVenueSurveyUrl', () => {
  it('should add the venue activity as venue_type query param', () => {
    const result = buildFollowVenueSurveyUrl(Activity.MUSEUM)

    expect(result).toEqual(`${FOLLOW_VENUE_SURVEY_URL}?venue_type=MUSEUM`)
  })

  it('should add the venue activity as venue_type query param for another activity', () => {
    const result = buildFollowVenueSurveyUrl(Activity.CINEMA)

    expect(result).toEqual(`${FOLLOW_VENUE_SURVEY_URL}?venue_type=CINEMA`)
  })

  it('should not add the venue_type query param when activity is null', () => {
    const result = buildFollowVenueSurveyUrl(null)

    expect(result).toEqual(FOLLOW_VENUE_SURVEY_URL)
  })

  it('should not add the venue_type query param when activity is undefined', () => {
    const result = buildFollowVenueSurveyUrl(undefined)

    expect(result).toEqual(FOLLOW_VENUE_SURVEY_URL)
  })
})
