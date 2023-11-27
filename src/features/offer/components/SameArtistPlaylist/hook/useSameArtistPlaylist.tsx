import { useQuery } from 'react-query'

import {
  FetchOfferByArtist,
  fetchOffersByArtist,
  HitOfferWithArtistAndEan,
} from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useSameArtistPlaylist = ({ artists, ean, searchGroupName }: FetchOfferByArtist) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const { data, refetch } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST],
    () => {
      return fetchOffersByArtist({ artists, ean, searchGroupName })
    },
    { enabled: !!netInfo.isConnected }
  )

  const hits = data?.map(transformHits) as HitOfferWithArtistAndEan[]

  return { sameArtistPlaylist: hits, refetch }
}
