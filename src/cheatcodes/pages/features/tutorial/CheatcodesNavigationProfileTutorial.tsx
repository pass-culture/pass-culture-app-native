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
      <LinkToScreen
        screen="ProfileTutorialAgeInformation"
        title="Page 15 ans"
        navigationParams={{ age: 15 }}
      />
      <LinkToScreen
        screen="ProfileTutorialAgeInformation"
        title="Page 16 ans"
        navigationParams={{ age: 16 }}
      />
      <LinkToScreen
        screen="ProfileTutorialAgeInformation"
        title="Page 17 ans"
        navigationParams={{ age: 17 }}
      />
      <LinkToScreen
        screen="ProfileTutorialAgeInformation"
        title="Page 18 ans"
        navigationParams={{ age: 18 }}
      />
    </CheatcodesTemplateScreen>
  )
}
