import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategoriesMapping } from 'libs/subcategories'

export type Artist = {
  name: string
  bio: string
}

// To remove when description is going to be provided
const textTest = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan sodales metus efficitur accumsan. Etiam aliquam lorem scelerisque volutpat dapibus. Nam sollicitudin quam a turpis mattis gravida ut at dolor. Sed leo lorem, vulputate vitae nulla elementum, ultricies varius velit. Curabitur felis lorem, hendrerit vitae purus aliquam, euismod dictum nisl. Nam vel gravida libero, non maximus nibh. In hac habitasse platea dictumst. Morbi ut magna vel elit dapibus sollicitudin et eu orci. Quisque commodo bibendum risus, nec aliquam dolor consequat vel. Nam quam nulla, pretium non vestibulum nec, convallis et elit.

Curabitur consectetur sapien et convallis fringilla. Suspendisse consequat nec sem non convallis. Aliquam pulvinar mi vitae felis commodo, eget ornare nulla lacinia. Fusce ultricies nibh dui, eget tempus orci placerat eu. Nam pulvinar metus quis purus semper, eu hendrerit justo consequat. Suspendisse potenti. Proin in elementum risus, nec porttitor purus. Vestibulum sodales, turpis eget feugiat maximus, purus nisl laoreet est, euismod pulvinar tellus elit quis enim. Mauris id scelerisque orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac interdum leo. Fusce non est nisi. Nam imperdiet in sem eu semper.`

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { data: offer } = useOffer({ offerId: params.fromOfferId })
  const subcategoriesMapping = useSubcategoriesMapping()

  if (!offer) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const mainArtistName = artists?.split(',')[0] ?? ''

  if (mainArtistName === '') return null

  const artistInfo: Artist = {
    name: mainArtistName,
    bio: textTest,
  }

  return enableArtistPage ? (
    <ArtistBody offer={offer} subcategory={subcategory} artist={artistInfo} />
  ) : (
    <PageNotFound />
  )
}
