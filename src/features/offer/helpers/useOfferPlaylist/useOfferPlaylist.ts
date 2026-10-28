import { useIsFocused } from '@react-navigation/native'
import { useMemo } from 'react'

import { OfferPagePlaylist, OfferResponse } from 'api/gen'
import { useOfferPagePlaylistsQuery } from 'features/offer/queries/useOfferPagePlaylistsQuery'
import { Position } from 'libs/location/location'
import { useUserLocation } from 'libs/locationV2/location.store'

type OfferPlaylistProps = {
  offer: OfferResponse
  userId?: number
}

export const useOfferPlaylist = ({ offer, userId }: OfferPlaylistProps): OfferPagePlaylist[] => {
  const userLocation = useUserLocation()
  const isFocused = useIsFocused()

  const { latitude, longitude } = userLocation ?? {}
  const roundedPosition: Position = useMemo(
    () => ({
      latitude: Number(latitude?.toFixed(3)),
      longitude: Number(longitude?.toFixed(3)),
    }),
    [latitude, longitude]
  )

  const position = userLocation ? roundedPosition : undefined

  const { data } = useOfferPagePlaylistsQuery({
    offerId: offer.id,
    shouldFetch: isFocused,
    position,
    userId: userId?.toString(),
  })

  return data?.playlists ?? []
}
