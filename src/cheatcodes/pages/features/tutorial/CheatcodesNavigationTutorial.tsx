import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Tutorial ❔">
      <LinkToScreen title="Onboarding  🛶" screen="CheatcodesNavigationOnboarding" />
      <LinkToScreen title="ProfileTutorial 👤" screen="CheatcodesNavigationProfileTutorial" />
    </CheatcodesTemplateScreen>
  )
}
