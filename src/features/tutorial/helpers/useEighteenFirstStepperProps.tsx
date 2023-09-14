import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps } from 'features/tutorial/components/CreditTimeline'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Spacer, Typo, getSpacing } from 'ui/theme'

type Underage = 15 | 16 | 17

const pastStep = (age: Underage, deposit: string): CreditComponentProps => ({
  creditStep: 'pastStep',
  children: <PastStepBlock text={`Tu as reçu ${deposit} à ${age}\u00a0ans`} />,
  iconComponent: <GreyUnlock />,
})

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
    children: <PastStepBlock text={`Ton crédit a été remis à 0 la veille de tes 18\u00a0ans`} />,
    iconComponent: <GreyWarning />,
  }

  const pastNoCreditStep: CreditComponentProps = {
    creditStep: 'pastStep',
    children: (
      <PastStepBlock
        text={'Les crédits précédents ne sont plus disponibles car tu as plus de 17\u00a0ans.'}
      />
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

const GreyUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  color2: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})

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
