import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { TutorialTypes } from 'features/tutorial/enums'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Offers } from 'ui/svg/icons/Offers'
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

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

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
  {
    creditStep: 'information',
    iconComponent: <GreyWarning />,
    children: (
      <InformationStepContent title="La veille de tes 18 ans" subtitle="Ton crédit est remis à 0" />
    ),
  },
  { creditStep: 18, children: <EighteenBlockDescription /> },
  {
    creditStep: 'information',
    iconComponent: <GreyOffers />,
    children: (
      <InformationStepContent
        title="Au bout de 2 ans, ton crédit expire… Mais l’aventure continue&nbsp;!"
        subtitle="Tu peux continuer à réserver des offres gratuites autour de chez toi."
      />
    ),
  },
]
