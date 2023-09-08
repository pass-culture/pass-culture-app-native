import React from 'react'
import styled from 'styled-components/native'

import { CreditBarWithSeparator } from 'features/profile/components/CreditInfo/CreditBarWithSeparator'
import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  activatedAt?: number | null
}

export const TutorialTimelineSixteen = ({ activatedAt }: Props) => {
  const { fifteenYearsOldDeposit } = useDepositAmountsByAge()
  const firstBlockText =
    activatedAt === 15
      ? `Tu as reçu ${fifteenYearsOldDeposit} à 15 ans`
      : 'Le crédit précédent n’est plus disponible car tu as plus de 15 ans.'

  const fullStepperProps: CreditComponentProps[] = [
    { creditStep: 'pastStep', children: <FirstBlock text={firstBlockText} /> },
    ...SixteenStepperProps,
  ]
  return <CreditTimeline age={16} stepperProps={fullStepperProps} type="profileTutorial" />
}

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

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
  {
    creditStep: 'information',
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
