import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Tutorial ❔">
      <LinkToComponent title="Onboarding  🛶" name="CheatcodesNavigationOnboarding" />
      <LinkToComponent title="ProfileTutorial 👤" name="CheatcodesNavigationProfileTutorial" />
    </CheatcodesTemplateScreen>
  )
}
