import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { ArtistBodyProxy } from 'features/artist/components/ArtistBody/ArtistBodyProxy'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export type Artist = {
  name: string
  bio?: string
}

export const Artist: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { data: offer } = useOfferQuery({ offerId: params.fromOfferId })
  const subcategoriesMapping = useSubcategoriesMapping()

  if (!offer) return null

  // TODO(PC-33464): point of vigilance when we will use a hook which get the artists from Algolia
  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const artists = getOfferArtists(subcategory.categoryId, offer)

  if (!artists) return null

  const artistInfo: Artist = {
    name: artists,
    bio: undefined,
  }

  return <ArtistBodyProxy offer={offer} subcategory={subcategory} artist={artistInfo} />
}
