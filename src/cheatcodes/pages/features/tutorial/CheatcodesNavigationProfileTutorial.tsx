import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreenWithNavigateTo } from 'cheatcodes/components/LinkToScreenWithNavigateTo'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToScreenWithNavigateTo
        title="Page 17-18 ans (V3)"
        navigateTo={getOnboardingNavConfig('ProfileTutorialAgeInformationCredit')}
      />
    </CheatcodesTemplateScreen>
  )
}
