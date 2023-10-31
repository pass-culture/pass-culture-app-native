import { useQuery } from 'react-query'

import {
  FetchOfferByArtist,
  fetchOffersByArtist,
  HitOfferWithArtistAndEan,
} from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useSameArtistPlaylist = ({ artist, ean }: FetchOfferByArtist) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const { data, refetch } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST],
    () => {
      if (!artist || !ean) return []
      return fetchOffersByArtist({ artist, ean })
    },
    { enabled: !!netInfo.isConnected }
  )

  if (!data) {
    return { sameArtistPlaylist: [], refetch }
  }

  const transformedHits = data?.map(transformHits) as HitOfferWithArtistAndEan[]

  return { sameArtistPlaylist: transformedHits, refetch }
}
