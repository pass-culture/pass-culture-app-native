import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import {
  eighteenSeparatorStep,
  lastStep,
} from 'features/tutorial/components/profileTutorial/Timelines/CommonSteps'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { TutorialTypes } from 'features/tutorial/enums'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  activatedAt?: number | null
}

export const TutorialTimelineSeventeen = ({ activatedAt }: Props) => {
  const { fifteenYearsOldDeposit, sixteenYearsOldDeposit } = useDepositAmountsByAge()

  const FirstStepperProps: CreditComponentProps[] = []
  switch (activatedAt) {
    case 15:
      FirstStepperProps.push({
        creditStep: 'pastStep',
        children: <PastStepBlock text={`Tu as reçu ${fifteenYearsOldDeposit} à 15\u00a0ans`} />,
      })
      FirstStepperProps.push({
        creditStep: 'pastStep',
        children: <PastStepBlock text={`Tu as reçu ${sixteenYearsOldDeposit} à 16\u00a0ans`} />,
      })
      break
    case 16:
      FirstStepperProps.push({
        creditStep: 'pastStep',
        children: <PastStepBlock text={`Tu as reçu ${sixteenYearsOldDeposit} à 16\u00a0ans`} />,
      })
      break
    default:
      FirstStepperProps.push({
        creditStep: 'pastStep',
        children: (
          <PastStepBlock
            text={'Les crédits précédents ne sont plus disponibles car tu as plus de 16\u00a0ans.'}
          />
        ),
      })
      break
  }

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

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const PastStepBlock = ({ text }: { text: string }) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <StyledCaption>{text}</StyledCaption>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

const SeventeenStepperProps: CreditComponentProps[] = [
  { creditStep: 17, children: <UnderageBlockDescription /> },
  eighteenSeparatorStep,
  { creditStep: 18, children: <EighteenBlockDescription /> },
  lastStep,
]
