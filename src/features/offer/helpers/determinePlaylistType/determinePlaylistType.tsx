import { PlaylistType } from 'features/offer/enums'

export function determinePlaylistType(playlistType?: PlaylistType) {
  if (playlistType === PlaylistType.SAME_ARTIST_PLAYLIST) {
    return 'same_artist_playlist'
  }

  return 'similar_offer'
}
