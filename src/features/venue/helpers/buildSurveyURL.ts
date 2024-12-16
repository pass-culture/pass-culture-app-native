import { VenueTypeCodeKey } from 'api/gen'
import { VENUE_VIDEO_FAKEDOOR_DATA } from 'features/venue/constants'

export const buildSurveyURL = (venueTypeCode: VenueTypeCodeKey | null | undefined) => {
  const urlOrigin = VENUE_VIDEO_FAKEDOOR_DATA.surveyURL

  if (venueTypeCode) {
    return `${urlOrigin}?VenueType=${venueTypeCode}`
  }
  return urlOrigin
}
