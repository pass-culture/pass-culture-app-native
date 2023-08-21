import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import {
  VerticalStepper,
  VerticalStepperProps,
} from 'features/profile/components/VerticalStepper/VerticalStepper'
import LottieView from 'libs/lottie'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Lock } from 'ui/svg/icons/Lock'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
  const stepperProps = stepperPropsMapping.get(age)
  return (
    <StyledView>
      {stepperProps?.map((props, index) => (
        <VerticalStepper
          key={index}
          {...props}
          isFirst={index === 0}
          isLast={index === stepperProps.length - 1}
        />
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
}))``

const MediumGreyLock = styled(Lock).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))``

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))``

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
