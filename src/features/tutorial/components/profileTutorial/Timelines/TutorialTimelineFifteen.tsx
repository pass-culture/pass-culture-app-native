import React from 'react'

import { CreditBarWithSeparator } from 'features/profile/components/CreditInfo/CreditBarWithSeparator'
import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import {
  eighteenSeparatorStep,
  lastStep,
} from 'features/tutorial/components/profileTutorial/Timelines/CommonSteps'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { TutorialTypes } from 'features/tutorial/enums'

export const TutorialTimelineFifteen: () => React.ReactElement = () => {
  return (
    <CreditTimeline
      age={15}
      stepperProps={FifteenStepperProps}
      type={TutorialTypes.PROFILE_TUTORIAL}
      testID="fifteen-timeline"
    />
  )
}

const FifteenStepperProps: CreditComponentProps[] = [
  { creditStep: 15, children: <UnderageBlockDescription /> },
  { creditStep: 16, children: <CreditBarWithSeparator currentStep={2} totalStep={3} /> },
  { creditStep: 17, children: <CreditBarWithSeparator currentStep={3} totalStep={3} /> },
  eighteenSeparatorStep,
  { creditStep: 18, children: <EighteenBlockDescription /> },
  lastStep,
]
