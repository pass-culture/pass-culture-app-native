import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

export const ArtistBody: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition } = useOpacityTransition()

  const { data: offer } = useOffer({ offerId: params.fromOfferId })
  const subcategoriesMapping = useSubcategoriesMapping()

  if (!offer) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]

  return (
    <View testID="artistContainer">
      <ContentHeader
        headerTitle="Artiste"
        onBackPress={goBack}
        headerTransition={headerTransition}
      />
      <ArtistPlaylist offer={offer} subcategory={subcategory} />
    </View>
  )
}
