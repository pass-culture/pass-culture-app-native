import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps } from 'features/tutorial/components/CreditTimeline'
import {
  PastStepBlock,
  pastStep,
} from 'features/tutorial/components/profileTutorial/Timelines/PastSteps'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { getSpacing } from 'ui/theme'

export const useEighteenFirstStepperProps = (
  activatedAt: number | null | undefined
): CreditComponentProps[] => {
  const { fifteenYearsOldDeposit, sixteenYearsOldDeposit, seventeenYearsOldDeposit } =
    useDepositAmountsByAge()

  const creditAt15Step = pastStep(15, fifteenYearsOldDeposit)

  const creditAt16Step = pastStep(16, sixteenYearsOldDeposit)

  const creditAt17Step = pastStep(17, seventeenYearsOldDeposit)

  const resetCreditStep: CreditComponentProps = {
    creditStep: 'pastStep',
    children: <PastStepBlock text="Ton crédit a été remis à 0 la veille de tes 18&nbsp;ans" />,
    iconComponent: <GreyWarning />,
  }

  const pastNoCreditStep: CreditComponentProps = {
    creditStep: 'pastStep',
    children: (
      <PastStepBlock text="Les crédits précédents ne sont plus disponibles car tu as plus de 17&nbsp;ans." />
    ),
  }

  if (activatedAt === 15) {
    return [creditAt15Step, creditAt16Step, creditAt17Step, resetCreditStep]
  }

  if (activatedAt === 16) {
    return [creditAt16Step, creditAt17Step, resetCreditStep]
  }

  if (activatedAt === 17) {
    return [creditAt17Step, resetCreditStep]
  }

  return [pastNoCreditStep]
}

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})
