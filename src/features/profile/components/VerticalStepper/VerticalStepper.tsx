import React, { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing } from 'ui/theme'

import {
  FirstVerticalStepperProps,
  LastVerticalStepperProps,
  NeitherFirstOrLastVerticalStepperProps,
  VerticalStepperVariant,
} from './types'

/**
 * I give the ability to know if this is the first or last item of the stepper
 * since we may want to hide top bar or bottom bar in a future.
 *
 * We may also want to do something else in this case, so TypeScript is ready to handle
 * these cases!
 */
export type VerticalStepperProps = (
  | FirstVerticalStepperProps
  | LastVerticalStepperProps
  | NeitherFirstOrLastVerticalStepperProps
) & {
  /**
   * Use this prop to handle correct stepper step.
   *
   * There is 3 variants available:
   * - `VerticalStepperVariant.complete` for completed step
   * - `VerticalStepperVariant.in_progress` for in-progress step
   * - `VerticalStepperVariant.future` for future step
   *
   * Each one has its own styling, and it should always be only one "in-progress" step.
   * It may exist 0 or more completed and future steps.
   */
  variant: VerticalStepperVariant
  /**
   * Use this if you want to override middle icon.
   */
  iconComponent?: JSX.Element
}

type CustomComponentProps = {
  testID?: string
}

export const VerticalStepper = memo(function VerticalStepper({
  variant,
  iconComponent,
}: VerticalStepperProps) {
  const theme = useTheme()

  const Icon = useCallback(
    (props: CustomComponentProps) => {
      if (iconComponent) return iconComponent

      if (variant === VerticalStepperVariant.complete)
        return (
          <Validate
            color={theme.colors.greenValid}
            color2={theme.colors.white}
            size={20}
            {...props}
          />
        )

      if (variant === VerticalStepperVariant.in_progress) return <InProgressIcon {...props} />

      return <FutureIcon {...props} />
    },
    [iconComponent, theme.colors.greenValid, theme.colors.white, variant]
  )

  const TopLine = useCallback(
    (props: CustomComponentProps) => {
      switch (variant) {
        case VerticalStepperVariant.complete:
        case VerticalStepperVariant.in_progress:
          return <FilledLine {...props} />

        // Only VerticalStepperVariant.future in this default case
        default:
          return <DottedLine {...props} />
      }
    },
    [variant]
  )

  const BottomLine = useCallback(
    (props: CustomComponentProps) => {
      switch (variant) {
        case VerticalStepperVariant.in_progress:
        case VerticalStepperVariant.future:
          return <DottedLine testID="bottom-line" {...props} />

        // Only VerticalStepperVariant.complete in this default case
        default:
          return <FilledLine testID="bottom-line" {...props} />
      }
    },
    [variant]
  )

  return (
    <Wrapper>
      <TopLine testID="top-line" />
      <Icon testID="icon" />
      <BottomLine testID="bottom-line" />
    </Wrapper>
  )
})

const Wrapper = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  gap: getSpacing(1),
  overflow: 'hidden',
})

const FilledLine = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
  width: getSpacing(1),
  borderRadius: 2,
  flex: 1,
}))

const DottedLine = styled.View(({ theme }) => ({
  width: 0,
  flex: 1,
  borderLeftWidth: 4,
  borderLeftColor: theme.colors.greyMedium,
  borderStyle: 'dotted',
}))

const InProgressIcon = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black,
  width: getSpacing(3),
  height: getSpacing(3),
  borderRadius: getSpacing(2),
}))

const FutureIcon = styled(InProgressIcon)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))
