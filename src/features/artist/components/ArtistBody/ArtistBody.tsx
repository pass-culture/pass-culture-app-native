import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

export const ArtistBody: FunctionComponent = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition } = useOpacityTransition()


  return (
    <View testID="artistContainer">
      <ContentHeader
        headerTitle="Artiste"
        onBackPress={goBack}
        headerTransition={headerTransition}
      />
    </View>
  )
}
