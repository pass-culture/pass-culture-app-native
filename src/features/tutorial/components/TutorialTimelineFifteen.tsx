import React from 'react'
import styled from 'styled-components/native'

import { CreditBarWithSeparator } from 'features/profile/components/CreditInfo/CreditBarWithSeparator'
import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { Offers } from 'ui/svg/icons/Offers'

export const TutorialTimelineFifteen: () => React.ReactElement = () => {
  return <CreditTimeline age={15} stepperProps={FifteenStepperProps} type="profileTutorial" />
}

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

const FifteenStepperProps: CreditComponentProps[] = [
  { creditStep: 15, children: <UnderageBlockDescription /> },
  { creditStep: 16, children: <CreditBarWithSeparator currentStep={2} totalStep={3} /> },
  { creditStep: 17, children: <CreditBarWithSeparator currentStep={3} totalStep={3} /> },
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
