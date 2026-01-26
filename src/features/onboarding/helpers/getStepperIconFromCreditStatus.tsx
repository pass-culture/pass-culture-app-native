import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { LockFilled } from 'ui/svg/icons/LockFilled'

export const getStepperIconFromCreditStatus = (creditStatus: CreditStatus): React.ReactElement => {
  switch (creditStatus) {
    case CreditStatus.GONE:
      return <GoneLock />
    case CreditStatus.ONGOING:
      return <AnimatedOngoingLock />
    case CreditStatus.COMING:
      return <ComingLock />
  }
}
const AnimatedOngoingLock = () => {
  const theme = useTheme()
  return (
    <ThemedStyledLottieView
      source={OnboardingUnlock}
      autoPlay
      loop={false}
      width={theme.icons.sizes.standard}
      height={theme.icons.sizes.standard}
      usePartialPlayback={false}
    />
  )
}

const ComingLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.s,
}))

const GoneLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
}))(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.s,
}))
