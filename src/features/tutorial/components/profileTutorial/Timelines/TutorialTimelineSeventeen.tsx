import React from 'react'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import {
  eighteenSeparatorStep,
  lastStep,
} from 'features/tutorial/components/profileTutorial/Timelines/CommonSteps'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { TutorialTypes } from 'features/tutorial/enums'
import { useSeventeenFirstStepperProps } from 'features/tutorial/helpers/useSeventeenFirstStepperProps'

interface Props {
  activatedAt?: number | null
}

export const TutorialTimelineSeventeen = ({ activatedAt }: Props) => {
  const FirstStepperProps = useSeventeenFirstStepperProps(activatedAt)

  const fullStepperProps: CreditComponentProps[] = [...FirstStepperProps, ...SeventeenStepperProps]
  return (
    <CreditTimeline
      age={17}
      stepperProps={fullStepperProps}
      type={TutorialTypes.PROFILE_TUTORIAL}
      testID="seventeen-timeline"
    />
  )
}

const SeventeenStepperProps: CreditComponentProps[] = [
  { creditStep: 17, children: <UnderageBlockDescription /> },
  eighteenSeparatorStep,
  { creditStep: 18, children: <EighteenBlockDescription /> },
  lastStep,
]
