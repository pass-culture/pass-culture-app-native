import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { OffersSimilars, VerticalPlaylistOffersData } from 'shared/verticalPlaylist/types'

export const useGetOffersSimilarsFromPlaylist = ({
  offer,
  type,
  userId,
}: OffersSimilars): VerticalPlaylistOffersData => {
  const playlists = useOfferPlaylist({
    offer,
    userId,
  })

  const selectedPlaylist = playlists.find((playlist) => playlist.analyticsPlaylistType === type)

  const items = useAlgoliaSimilarOffersQuery(selectedPlaylist?.results ?? [], true) ?? []

  const title = selectedPlaylist?.title ?? ''

  return {
    items,
    title,
  }
}
