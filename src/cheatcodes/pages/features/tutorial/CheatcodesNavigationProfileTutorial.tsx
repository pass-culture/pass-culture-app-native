import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { TutorialTypes } from 'features/tutorial/enums'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToScreen
        screen="AgeSelectionFork"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToScreen
        screen="EligibleUserAgeSelection"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToScreen
        screen="AgeSelectionOther"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToScreen screen="ProfileTutorialAgeInformationCreditV3" title="Page 17-18 ans (V3)" />
    </CheatcodesTemplateScreen>
  )
}
