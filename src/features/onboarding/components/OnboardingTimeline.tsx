import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import {
  VerticalStepper,
  VerticalStepperProps,
} from 'features/profile/components/VerticalStepper/VerticalStepper'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
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
        <VerticalStepper key={index} {...props} />
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

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))``

const stepperPropsMapping = new Map<15 | 16 | 17 | 18, VerticalStepperProps[]>([
  [
    15,
    [
      { variant: StepVariant.in_progress, iconComponent: <BicolorUnlock />, isFirst: true },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock />, isLast: true },
    ],
  ],
  [
    16,
    [
      { variant: StepVariant.complete, iconComponent: <GreyLock />, isFirst: true },
      { variant: StepVariant.in_progress, iconComponent: <BicolorUnlock /> },
      { variant: StepVariant.future, iconComponent: <GreyLock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock />, isLast: true },
    ],
  ],
  [
    17,
    [
      { variant: StepVariant.complete, iconComponent: <GreyLock />, isFirst: true },
      { variant: StepVariant.complete, iconComponent: <GreyLock /> },
      { variant: StepVariant.in_progress, iconComponent: <BicolorUnlock /> },
      { variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { variant: StepVariant.future, iconComponent: <GreyLock />, isLast: true },
    ],
  ],
  [
    18,
    [
      { variant: StepVariant.complete, iconComponent: <GreyLock />, isFirst: true },
      { variant: StepVariant.complete, iconComponent: <GreyLock /> },
      { variant: StepVariant.complete, iconComponent: <GreyLock /> },
      { variant: StepVariant.in_progress, iconComponent: <BicolorUnlock />, isLast: true },
    ],
  ],
])
