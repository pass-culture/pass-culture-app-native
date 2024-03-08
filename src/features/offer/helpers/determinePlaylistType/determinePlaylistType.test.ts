import { PlaylistType } from 'features/offerv2/enums'
import { determinePlaylistType } from 'features/offer/helpers/determinePlaylistType/determinePlaylistType'

describe('determinePlaylistCategory', () => {
  it('should return "same_artist_playlist" when playlistType is SAME_ARTIST_PLAYLIST', () => {
    const result = determinePlaylistType(PlaylistType.SAME_ARTIST_PLAYLIST)

    expect(result).toEqual('same_artist_playlist')
  })

  it('should return "similar_offer" when no playlist types is not specified', () => {
    const result = determinePlaylistType()

    expect(result).toEqual('similar_offer')
  })
})
