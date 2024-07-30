import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

export const ArtistScreen = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition } = useOpacityTransition()

  return (
    <View>
      <ContentHeader
        headerTitle="Artiste"
        onBackPress={goBack}
        headerTransition={headerTransition}
      />
    </View>
  )
}
