import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { LockFilled } from 'ui/svg/icons/LockFilled'
import { getSpacing } from 'ui/theme'

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
      width={theme.designSystem.size.icon.l}
      height={theme.designSystem.size.icon.l}
      usePartialPlayback={false}
    />
  )
}

const ComingLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))({
  marginHorizontal: getSpacing(1.5),
})

const GoneLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
}))({
  // ds value does not exist yet and breaks design with spacing.s
  // eslint-disable-next-line local-rules/no-get-spacing
  marginHorizontal: getSpacing(1.5),
})
