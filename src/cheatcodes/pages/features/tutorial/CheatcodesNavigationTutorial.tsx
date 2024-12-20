import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationTutorial(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="Tutorial ❔">
      <LinkToComponent
        title="Onboarding  🛶"
        onPress={() => navigate('CheatcodesNavigationOnboarding')}
      />
      <LinkToComponent
        title="ProfileTutorial 👤"
        onPress={() => navigate('CheatcodesNavigationProfileTutorial')}
      />
    </CheatcodesTemplateScreen>
  )
}
