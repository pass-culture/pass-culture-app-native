import React, { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { DotSize, FirstOrLastProps, StepVariantProps } from 'ui/components/types'
import { AutomaticVerticalDots } from 'ui/components/VerticalDots/AutomaticVerticalDots'
import { StepperValidate } from 'ui/svg/icons/StepperValidate'
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
    addMoreSpacingToIcons?: boolean
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
  addMoreSpacingToIcons,
}: VerticalStepperProps) {
  const { designSystem } = useTheme()

  const Icon = useCallback(
    (props: CustomComponentProps) => {
      if (iconComponent) return iconComponent

      if (variant === StepVariant.complete)
        return <StepperValidate color={designSystem.color.icon.success} size={20} {...props} />

      if (variant === StepVariant.in_progress) return <InProgressIcon {...props} />

      return <FutureIcon {...props} />
    },
    [iconComponent, designSystem.color.icon.success, variant]
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
            <AutomaticVerticalDots
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
            <AutomaticVerticalDots
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
      <IconWrapper addMoreSpacingToIcons={addMoreSpacingToIcons}>
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
  backgroundColor: theme.designSystem.color.border.default,
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
  backgroundColor: theme.designSystem.color.background.inverted,
  width: IN_PROGRESS_ICON_SIZE,
  height: IN_PROGRESS_ICON_SIZE,
  borderRadius: IN_PROGRESS_ICON_SIZE / 2,
  marginHorizontal: (20 - IN_PROGRESS_ICON_SIZE) / 2,
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.inverted,
}))

const FutureIcon = styled(InProgressIcon)(({ theme }) => ({
  backgroundColor: theme.designSystem.separator.color.default,
}))

const IconWrapper = styled.View<{ addMoreSpacingToIcons: boolean }>(
  ({ addMoreSpacingToIcons }) => ({
    marginVertical: addMoreSpacingToIcons ? getSpacing(2.5) : getSpacing(0.5),
  })
)
