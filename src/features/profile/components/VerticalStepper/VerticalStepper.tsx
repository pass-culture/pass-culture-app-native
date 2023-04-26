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
}

export const VerticalStepper = memo(function VerticalStepper({ variant }: VerticalStepperProps) {
  const theme = useTheme()

  const Icon = useCallback(() => {
    if (variant === VerticalStepperVariant.complete)
      return <Validate color={theme.colors.greenValid} color2={theme.colors.white} size={20} />

    if (variant === VerticalStepperVariant.in_progress) return <InProgressIcon />
    if (variant === VerticalStepperVariant.future) return <FutureIcon />

    return null
  }, [theme.colors.greenValid, theme.colors.white, variant])

  const TopLine = useCallback(() => {
    switch (variant) {
      case VerticalStepperVariant.complete:
      case VerticalStepperVariant.in_progress:
        return <FilledLine />

      case VerticalStepperVariant.future:
        return <DottedLine />

      default:
        return null
    }
  }, [variant])

  const BottomLine = useCallback(() => {
    switch (variant) {
      case VerticalStepperVariant.complete:
        return <FilledLine />

      case VerticalStepperVariant.in_progress:
      case VerticalStepperVariant.future:
        return <DottedLine />

      default:
        return null
    }
  }, [variant])

  return (
    <Wrapper>
      <TopLine />
      <Icon />
      <BottomLine />
    </Wrapper>
  )
})

const DottedLine = styled.View(({ theme }) => ({
  width: 0,
  flex: 1,
  borderLeftWidth: 4,
  borderLeftColor: theme.colors.greyMedium,
  borderStyle: 'dotted',
}))

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

const InProgressIcon = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black,
  width: getSpacing(3),
  height: getSpacing(3),
  borderRadius: getSpacing(2),
}))

const FutureIcon = styled(InProgressIcon)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))
