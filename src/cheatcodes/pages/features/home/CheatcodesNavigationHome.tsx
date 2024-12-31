import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const CheatcodesNavigationHome = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <CheatcodesTemplateScreen title="Home 🏠">
      <LinkToScreen
        title="HighlightThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenHighlightThematicHomeHeader')}
      />
      <LinkToScreen
        title="DefaultThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenDefaultThematicHomeHeader')}
      />
      <LinkToScreen
        title="CategoryThematicHomeHeader"
        onPress={() => navigate('CheatcodesScreenCategoryThematicHomeHeader')}
      />
    </CheatcodesTemplateScreen>
  )
}
