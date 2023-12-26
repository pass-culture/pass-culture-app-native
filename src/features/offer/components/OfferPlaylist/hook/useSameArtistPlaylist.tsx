import { useQuery } from 'react-query'

import {
  FetchOfferByArtist,
  fetchOffersByArtist,
  HitOfferWithArtistAndEan,
} from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useSameArtistPlaylist = ({
  artists,
  ean,
  searchGroupName,
  venueLocation,
}: FetchOfferByArtist) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const { data, refetch } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST],
    () => {
      return fetchOffersByArtist({ artists, ean, searchGroupName, venueLocation })
    },
    { enabled: !!netInfo.isConnected, initialData: [] }
  )

  const sameArtistPlaylist = data?.map(transformHits) as HitOfferWithArtistAndEan[]

  return { sameArtistPlaylist, refetchSameArtistPlaylist: refetch }
}
