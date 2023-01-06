import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'
import LottieView from 'libs/lottie'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Lock } from 'ui/svg/icons/Lock'

type Props = {
  status: CreditStatus
}

export const CreditBlockIcon: FunctionComponent<Props> = ({ status }) => {
  if (status === CreditStatus.ONGOING) {
    return <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
  }

  return <StyledLock status={status} />
}

const StyledLottieView = styled(LottieView)(({ theme }) => ({
  width: theme.icons.sizes.standard,
  height: theme.icons.sizes.standard,
}))

const StyledLock = styled(Lock).attrs<{ status: CreditStatus }>(({ theme, status }) => ({
  color: status === CreditStatus.GONE ? theme.colors.greyMedium : theme.colors.greyDark,
}))<{ status: CreditStatus }>``
