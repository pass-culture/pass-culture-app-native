import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToScreen screen="ProfileTutorialAgeInformationCredit" title="Page 17-18 ans (V3)" />
    </CheatcodesTemplateScreen>
  )
}
