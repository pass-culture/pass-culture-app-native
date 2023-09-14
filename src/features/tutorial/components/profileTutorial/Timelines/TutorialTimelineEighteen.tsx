import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { useEighteenFirstStepperProps } from 'features/tutorial/helpers/useEighteenFirstStepperProps'
import { Offers } from 'ui/svg/icons/Offers'

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

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

const EighteenStepperProps: CreditComponentProps[] = [
  { creditStep: 18, children: <EighteenBlockDescription ongoingCredit /> },
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
