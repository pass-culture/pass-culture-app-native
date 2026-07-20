import { SearchGroupNameEnumv2 } from 'api/gen'

const FOLLOW_ARTIST_SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU'

type Params = {
  artistId?: string
  // Qualtrics embedded data: culture category of the offer(s) the survey was triggered from
  offerType?: SearchGroupNameEnumv2
}

export const buildFollowArtistSurveyUrl = ({ artistId, offerType }: Params = {}): string => {
  const searchParams = new URLSearchParams()
  if (artistId) searchParams.append('artistId', artistId)
  if (offerType) searchParams.append('offer_type', offerType)

  const query = searchParams.toString()
  return query ? `${FOLLOW_ARTIST_SURVEY_URL}?${query}` : FOLLOW_ARTIST_SURVEY_URL
}
