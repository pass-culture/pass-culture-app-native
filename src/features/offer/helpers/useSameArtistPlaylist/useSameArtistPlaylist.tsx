import { useQuery } from 'react-query'

import {
  FetchOfferByArtist,
  fetchOffersByArtist,
  HitOfferWithArtistAndEan,
} from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useSameArtistPlaylist = ({
  artists,
  searchGroupName,
  venueLocation,
}: FetchOfferByArtist) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const { data } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST, artists],
    () => {
      return fetchOffersByArtist({ artists, searchGroupName, venueLocation })
    },
    { enabled: !!netInfo.isConnected, initialData: [] }
  )

  const sameArtistPlaylist = data?.map(transformHits) as HitOfferWithArtistAndEan[]

  return { sameArtistPlaylist }
}
