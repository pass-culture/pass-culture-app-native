import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { TutorialTypes } from 'features/tutorial/enums'

export function CheatcodesNavigationProfileTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="ProfileTutorial 👤">
      <LinkToComponent
        name="AgeSelectionFork"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        name="EligibleUserAgeSelection"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        name="AgeSelectionOther"
        navigationParams={{ type: TutorialTypes.PROFILE_TUTORIAL }}
      />
      <LinkToComponent
        name="ProfileTutorialAgeInformation"
        title="Page 15 ans"
        navigationParams={{ age: 15 }}
      />
      <LinkToComponent
        name="ProfileTutorialAgeInformation"
        title="Page 16 ans"
        navigationParams={{ age: 16 }}
      />
      <LinkToComponent
        name="ProfileTutorialAgeInformation"
        title="Page 17 ans"
        navigationParams={{ age: 17 }}
      />
      <LinkToComponent
        name="ProfileTutorialAgeInformation"
        title="Page 18 ans"
        navigationParams={{ age: 18 }}
      />
    </CheatcodesTemplateScreen>
  )
}
