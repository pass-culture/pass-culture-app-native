import React, { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ValidateIcon } from 'features/profile/components/ValidateIcon'
import { DotSize, VerticalDots } from 'features/profile/components/VerticalDots/VerticalDots'
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
    iconComponent?: React.JSX.Element
  }

type CustomComponentProps = FirstOrLastProps & {
  testID?: string
}

const IN_PROGRESS_ICON_SIZE = getSpacing(3)
const DOT_SIZE: DotSize = { width: 2, height: 3 }
const SPECIAL_DOT_SIZE: DotSize = { width: 2, height: 2.5 }

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
          return (
            <VerticalDots.Auto
              dotSize={DOT_SIZE}
              lastDotSize={SPECIAL_DOT_SIZE}
              endsWithDot
              {...props}
            />
          )
      }
    },
    [variant]
  )

  const BottomLine = useCallback(
    (props: CustomComponentProps) => {
      if (props.isLast) return <BottomFilledLine isLast />
      switch (variant) {
        case StepVariant.in_progress:
        case StepVariant.future:
          return (
            <VerticalDots.Auto
              dotSize={DOT_SIZE}
              firstDotSize={SPECIAL_DOT_SIZE}
              endsWithDot={false}
              testID="bottom-line"
              {...props}
            />
          )

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
      <IconWrapper>
        <Icon testID="icon" />
      </IconWrapper>
      <BottomLine testID="bottom-line" isFirst={isFirst} isLast={isLast} />
    </Wrapper>
  )
})

const Wrapper = styled.View({
  alignItems: 'center',
  flex: 1,
  overflow: 'hidden',
})

const FilledLine = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
  width: 2,
  borderRadius: 2,
  flex: 1,
}))

const TopFilledLine = styled(FilledLine)<FirstOrLastProps>(({ isFirst }) => ({
  borderTopLeftRadius: isFirst ? 2 : 0,
  borderTopRightRadius: isFirst ? 2 : 0,
}))

const BottomFilledLine = styled(FilledLine)<FirstOrLastProps>(({ isLast }) => ({
  opacity: isLast ? 0 : 1,
}))

const InProgressIcon = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black,
  width: IN_PROGRESS_ICON_SIZE,
  height: IN_PROGRESS_ICON_SIZE,
  borderRadius: IN_PROGRESS_ICON_SIZE / 2,
  marginHorizontal: (20 - IN_PROGRESS_ICON_SIZE) / 2,
  borderWidth: 2,
  borderColor: theme.colors.white,
}))

const FutureIcon = styled(InProgressIcon)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))

const IconWrapper = styled.View({
  marginVertical: getSpacing(0.5),
})
