import React from 'react'

import { CreditComponentProps } from 'features/tutorial/components/CreditTimeline'
import {
  PastStepBlock,
  pastStep,
} from 'features/tutorial/components/profileTutorial/Timelines/PastSteps'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'

export const useSeventeenFirstStepperProps = (
  activatedAt: number | null | undefined
): CreditComponentProps[] => {
  const { fifteenYearsOldDeposit, sixteenYearsOldDeposit } = useDepositAmountsByAge()

  const creditAt15Step = pastStep(15, fifteenYearsOldDeposit)

  const creditAt16Step = pastStep(16, sixteenYearsOldDeposit)

  const pastNoCreditStep: CreditComponentProps = {
    creditStep: 'pastStep',
    children: (
      <PastStepBlock text="Les crédits précédents ne sont plus disponibles car tu as plus de 16&nbsp;ans." />
    ),
  }

  if (activatedAt === 15) {
    return [creditAt15Step, creditAt16Step]
  }

  if (activatedAt === 16) {
    return [creditAt16Step]
  }

  return [pastNoCreditStep]
}
