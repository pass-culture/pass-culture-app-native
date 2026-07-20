import { Activity } from 'api/gen'

export const FOLLOW_VENUE_SURVEY_URL =
  'https://passculture.qualtrics.com/jfe/form/SV_b3novwqFYApLUDY'

// venue_type is declared as embedded data on the Qualtrics side, so responses
// can be filtered by venue activity. Omitted when the venue has no activity.
export const buildFollowVenueSurveyUrl = (activity?: Activity | null): string =>
  activity ? `${FOLLOW_VENUE_SURVEY_URL}?venue_type=${activity}` : FOLLOW_VENUE_SURVEY_URL
