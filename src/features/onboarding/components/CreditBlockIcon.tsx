import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { customEaseInOut } from 'features/onboarding/helpers/animationProps'
import { CreditStatus } from 'features/onboarding/types'
import LottieView from 'libs/lottie'
import { AnimatedView, NAV_DELAY_IN_MS, pxToPercent } from 'libs/react-native-animatable'
import { theme } from 'theme'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Lock } from 'ui/svg/icons/Lock'

type Props = {
  status: CreditStatus
}

const iconAnimation = {
  from: {
    transform: [{ scale: pxToPercent({ startSize: 28, endSize: theme.icons.sizes.standard }) }],
  },
  to: {
    transform: [{ scale: 1 }],
  },
}

export const CreditBlockIcon: FunctionComponent<Props> = ({ status }) => {
  if (status === CreditStatus.ONGOING) {
    return (
      <AnimatedView
        animation={iconAnimation}
        duration={240}
        delay={NAV_DELAY_IN_MS}
        easing={customEaseInOut}>
        <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
      </AnimatedView>
    )
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
