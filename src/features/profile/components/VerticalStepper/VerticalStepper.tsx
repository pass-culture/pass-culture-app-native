import React, { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ValidateIcon } from 'features/profile/components/ValidateIcon'
import { FirstOrLastProps, StepVariantProps } from 'features/profile/types'
import { getSpacing } from 'ui/theme'

import { StepVariant } from './types'

/**
 * I give the ability to know if this is the first or last item of the stepper
 * since we may want to hide top bar or bottom bar in a future.
 *
 * We may also want to do something else in this case, so TypeScript is ready to handle
 * these cases!
 */
export type VerticalStepperProps = FirstOrLastProps &
  StepVariantProps & {
    /**
     * Use this if you want to override middle icon.
     */
    iconComponent?: JSX.Element
  }

type CustomComponentProps = FirstOrLastProps & {
  testID?: string
}

export const DOT_SIZE = 2

export const VerticalStepper = memo(function VerticalStepper({
  variant,
  iconComponent,
  isFirst,
  isLast,
}: VerticalStepperProps) {
  const theme = useTheme()

  const Icon = useCallback(
    (props: CustomComponentProps) => {
      if (iconComponent) return iconComponent

      if (variant === StepVariant.complete)
        return (
          <ValidateIcon
            color={theme.colors.greenValid}
            color2={theme.colors.white}
            size={20}
            {...props}
          />
        )

      if (variant === StepVariant.in_progress) return <InProgressIcon {...props} />

      return <FutureIcon {...props} />
    },
    [iconComponent, theme.colors.greenValid, theme.colors.white, variant]
  )

  const TopLine = useCallback(
    (props: CustomComponentProps) => {
      switch (variant) {
        case StepVariant.complete:
        case StepVariant.in_progress:
          return <TopFilledLine {...props} />

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
        case StepVariant.in_progress:
        case StepVariant.future:
          return <DottedLine testID="bottom-line" {...props} />

        // Only VerticalStepperVariant.complete in this default case
        default:
          return <BottomFilledLine testID="bottom-line" {...props} />
      }
    },
    [variant]
  )

  return (
    <Wrapper testID={`vertical-stepper-${variant}`}>
      <TopLine testID="top-line" isFirst={isFirst} isLast={isLast} />
      <Icon testID="icon" />
      <BottomLine testID="bottom-line" isFirst={isFirst} isLast={isLast} />
    </Wrapper>
  )
})

const Wrapper = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
  gap: getSpacing(1),
  overflow: 'hidden',
})

const FilledLine = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
  width: DOT_SIZE,
  borderRadius: 2,
  flexGrow: 1,
}))

const TopFilledLine = styled(FilledLine)<FirstOrLastProps>(({ isFirst }) => ({
  borderTopLeftRadius: isFirst ? 2 : 0,
  borderTopRightRadius: isFirst ? 2 : 0,
}))

const BottomFilledLine = styled(FilledLine)<FirstOrLastProps>(({ isLast }) => ({
  borderBottomLeftRadius: isLast ? 2 : 0,
  borderBottomRightRadius: isLast ? 2 : 0,
}))

const DottedLine = styled.View(({ theme }) => ({
  width: DOT_SIZE,
  flexGrow: 1,
  borderLeftWidth: DOT_SIZE,
  borderLeftColor: theme.colors.greyMedium,
  borderStyle: 'dotted',
}))

const InProgressIcon = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black,
  width: getSpacing(3),
  height: getSpacing(3),
  borderRadius: getSpacing(2),
  marginHorizontal: getSpacing(1),
}))

const FutureIcon = styled(InProgressIcon)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))
