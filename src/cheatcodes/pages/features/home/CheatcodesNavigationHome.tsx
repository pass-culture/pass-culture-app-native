import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const CheatcodesNavigationHome = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <CheatcodesTemplateScreen title="Home 🏠">
      <LinkToComponent
        title="HighlightThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenHighlightThematicHomeHeader')}
      />
      <LinkToComponent
        title="DefaultThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenDefaultThematicHomeHeader')}
      />
      <LinkToComponent
        title="CategoryThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenCategoryThematicHomeHeader')}
      />
    </CheatcodesTemplateScreen>
  )
}
