import React from 'react'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { lastStep } from 'features/tutorial/components/profileTutorial/Timelines/CommonSteps'
import { useEighteenFirstStepperProps } from 'features/tutorial/helpers/useEighteenFirstStepperProps'

type Props = {
  activatedAt?: number | null
}
export const TutorialTimelineEighteen = ({ activatedAt }: Props) => {
  const FirstStepperProps: CreditComponentProps[] = useEighteenFirstStepperProps(activatedAt)

  const fullStepperProps: CreditComponentProps[] = [...FirstStepperProps, ...EighteenStepperProps]
  return (
    <CreditTimeline
      age={18}
      stepperProps={fullStepperProps}
      type="profileTutorial"
      testID="eighteen-timeline"
    />
  )
}

const EighteenStepperProps: CreditComponentProps[] = [
  { creditStep: 18, children: <EighteenBlockDescription ongoingCredit /> },
  lastStep,
]
