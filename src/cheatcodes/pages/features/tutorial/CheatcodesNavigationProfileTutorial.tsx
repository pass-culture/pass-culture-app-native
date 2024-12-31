import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { TutorialTypes } from 'features/tutorial/enums'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToComponent
        screen="AgeSelectionFork"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        screen="EligibleUserAgeSelection"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        screen="AgeSelectionOther"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        screen="ProfileTutorialAgeInformation"
        title="Page 15 ans"
        navigationParams={{ age: 15 }}
      />
      <LinkToComponent
        screen="ProfileTutorialAgeInformation"
        title="Page 16 ans"
        navigationParams={{ age: 16 }}
      />
      <LinkToComponent
        screen="ProfileTutorialAgeInformation"
        title="Page 17 ans"
        navigationParams={{ age: 17 }}
      />
      <LinkToComponent
        screen="ProfileTutorialAgeInformation"
        title="Page 18 ans"
        navigationParams={{ age: 18 }}
      />
    </CheatcodesTemplateScreen>
  )
}
