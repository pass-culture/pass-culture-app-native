import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import LottieView from 'libs/lottie'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
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
const AnimatedOngoingLock = () => (
  <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
)

const ComingLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))({
  marginHorizontal: getSpacing(1.5),
})

const GoneLock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
}))({
  marginHorizontal: getSpacing(1.5),
})

const StyledLottieView = styled(LottieView)(({ theme }) => ({
  width: theme.icons.sizes.standard,
  height: theme.icons.sizes.standard,
}))
