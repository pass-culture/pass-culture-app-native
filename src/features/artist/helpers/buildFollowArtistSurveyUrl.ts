import { SearchGroupNameEnumv2 } from 'api/gen'
import { StorageKey } from 'libs/storage'

const FOLLOW_ARTIST_SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU'

export const FOLLOW_ARTIST_SURVEY_KEY: StorageKey = 'has_seen_follow_artist_fake_door_survey'
export const FOLLOW_ARTIST_FEATURE_NAME = 'follow_artist'

type Params = {
  artistId?: string
  offerType?: SearchGroupNameEnumv2
}

export const buildFollowArtistSurveyUrl = ({ artistId, offerType }: Params = {}): string => {
  const searchParams = new URLSearchParams()
  if (artistId) searchParams.append('artist_id', artistId)
  if (offerType) searchParams.append('offer_type', offerType)

  const query = searchParams.toString()
  return query ? `${FOLLOW_ARTIST_SURVEY_URL}?${query}` : FOLLOW_ARTIST_SURVEY_URL
}
