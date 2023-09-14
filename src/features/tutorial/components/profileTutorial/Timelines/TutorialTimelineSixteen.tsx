import React from 'react'
import styled from 'styled-components/native'

import { CreditBarWithSeparator } from 'features/profile/components/CreditInfo/CreditBarWithSeparator'
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

export const TutorialTimelineSixteen = ({ activatedAt }: Props) => {
  const { fifteenYearsOldDeposit } = useDepositAmountsByAge()
  const firstBlockText =
    activatedAt === 15
      ? `Tu as reçu ${fifteenYearsOldDeposit} à 15\u00a0ans`
      : 'Le crédit précédent n’est plus disponible car tu as plus de 15 ans.'

  const fullStepperProps: CreditComponentProps[] = [
    { creditStep: 'pastStep', children: <FirstBlock text={firstBlockText} /> },
    ...SixteenStepperProps,
  ]
  return (
    <CreditTimeline
      age={16}
      stepperProps={fullStepperProps}
      type={TutorialTypes.PROFILE_TUTORIAL}
      testID="sixteen-timeline"
    />
  )
}

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const FirstBlock = ({ text }: { text: string }) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <StyledCaption>{text}</StyledCaption>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

const SixteenStepperProps: CreditComponentProps[] = [
  { creditStep: 16, children: <UnderageBlockDescription /> },
  { creditStep: 17, children: <CreditBarWithSeparator currentStep={2} totalStep={3} /> },
  eighteenSeparatorStep,
  { creditStep: 18, children: <EighteenBlockDescription /> },
  lastStep,
]
