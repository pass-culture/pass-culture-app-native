import { SearchGroupNameEnumv2 } from 'api/gen'
import { buildFollowArtistSurveyUrl } from 'features/artist/helpers/buildFollowArtistSurveyUrl'

const SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU'

describe('buildFollowArtistSurveyUrl', () => {
  it('should return the bare survey url when no param is provided', () => {
    expect(buildFollowArtistSurveyUrl()).toEqual(SURVEY_URL)
  })

  it('should append artistId only', () => {
    expect(buildFollowArtistSurveyUrl({ artistId: '1' })).toEqual(`${SURVEY_URL}?artistId=1`)
  })

  it('should append offer_type only', () => {
    expect(buildFollowArtistSurveyUrl({ offerType: SearchGroupNameEnumv2.LIVRES })).toEqual(
      `${SURVEY_URL}?offer_type=LIVRES`
    )
  })

  it('should append both artistId and offer_type', () => {
    expect(
      buildFollowArtistSurveyUrl({ artistId: '1', offerType: SearchGroupNameEnumv2.MUSIQUE })
    ).toEqual(`${SURVEY_URL}?artistId=1&offer_type=MUSIQUE`)
  })
})
