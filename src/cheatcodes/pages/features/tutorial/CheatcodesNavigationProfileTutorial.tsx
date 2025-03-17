import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreenWithNavigateTo } from 'cheatcodes/components/LinkToScreenWithNavigateTo'
import { getActivationNavConfig } from 'features/navigation/ActivationStackNavigator/getActivationNavConfig'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToScreenWithNavigateTo
        title="Page 17-18 ans (V3)"
        navigateTo={getActivationNavConfig('ProfileTutorialAgeInformationCredit')}
      />
    </CheatcodesTemplateScreen>
  )
}
