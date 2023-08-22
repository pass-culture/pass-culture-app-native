import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { InternalStep } from 'features/profile/components/InternalStep/InternalStep'
import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { VerticalStepperProps } from 'features/profile/components/VerticalStepper/VerticalStepper'
import LottieView from 'libs/lottie'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Lock } from 'ui/svg/icons/Lock'
import { getSpacing } from 'ui/theme'

interface Props {
  age: 15 | 16 | 17 | 18
  children: ReactNode
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age, children }) => {
  const stepperProps = stepperPropsMapping.get(age)
  return (
    <StyledView>
      {stepperProps?.map((props, index) => (
        <InternalStep
          key={index}
          {...props}
          isFirst={index === 0}
          isLast={index === stepperProps.length - 1}>
          {children}
        </InternalStep>
      ))}
    </StyledView>
  )
}

const StyledView = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
  height: 500,
})

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

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})

const StyledLottieView = styled(LottieView)(({ theme }) => ({
  width: theme.icons.sizes.standard,
  height: theme.icons.sizes.standard,
}))

const AnimatedBicolorUnlock = () => (
  <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
)

const stepperPropsMapping = new Map<Props['age'], VerticalStepperProps[]>([
  [
    15,
    [
      { variant: StepVariant.in_progress, iconComponent: <AnimatedBicolorUnlock /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    16,
    [
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.in_progress, iconComponent: <AnimatedBicolorUnlock /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    17,
    [
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.in_progress, iconComponent: <AnimatedBicolorUnlock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    18,
    [
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { variant: StepVariant.in_progress, iconComponent: <AnimatedBicolorUnlock /> },
    ],
  ],
])
