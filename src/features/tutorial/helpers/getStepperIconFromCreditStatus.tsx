import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/tutorial/enums'
import LottieView from 'libs/lottie'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Lock } from 'ui/svg/icons/Lock'
import { getSpacing } from 'ui/theme'

export const getStepperIconFromCreditStatus = (creditStatus: CreditStatus): React.ReactElement => {
  switch (creditStatus) {
    case CreditStatus.GONE:
      return <MediumGreyLock />
    case CreditStatus.ONGOING:
      return <AnimatedBicolorUnlock />
    case CreditStatus.COMING:
      return <GreyLock />
  }
}
const AnimatedBicolorUnlock = () => (
  <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
)

const GreyLock = styled(Lock).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))({
  marginHorizontal: getSpacing(1.5),
})

const MediumGreyLock = styled(Lock).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))({
  marginHorizontal: getSpacing(1.5),
})
const StyledLottieView = styled(LottieView)(({ theme }) => ({
  width: theme.icons.sizes.standard,
  height: theme.icons.sizes.standard,
}))
