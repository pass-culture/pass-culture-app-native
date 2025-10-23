import React from 'react'
import styled from 'styled-components/native'

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
  variant: StepVariant
  iconComponent?: React.JSX.Element
}

const IN_PROGRESS_ICON_SIZE = getSpacing(3)
const DOT_SIZE: DotSize = { width: 2, height: 3 }
const SPECIAL_DOT_SIZE: DotSize = { width: 2, height: 2.5 }

const BottomLine = ({ variant, ...props }: CustomComponentProps) => {
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
}
const TopLine = ({ variant, ...props }: CustomComponentProps) => {
  switch (variant) {
    case StepVariant.complete:
    case StepVariant.in_progress:
    case StepVariant.unknown:
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
}
const Icon = ({ variant, ...props }: CustomComponentProps) => {
  if (props.iconComponent) return props.iconComponent

  if (variant === StepVariant.complete) return <StepperValidateSuccess {...props} />

  if (variant === StepVariant.in_progress) return <InProgressIcon {...props} />

  if (variant === StepVariant.unknown) return null

  return <FutureIcon {...props} />
}
export const VerticalStepper = ({
  variant,
  iconComponent,
  isFirst,
  isLast,
  addMoreSpacingToIcons,
}: VerticalStepperProps) => {
  const noIcon = variant === StepVariant.unknown && !iconComponent

  return (
    <Wrapper testID={`vertical-stepper-${variant}`}>
      <TopLine testID="top-line" isFirst={isFirst} isLast={isLast} variant={variant} />
      <IconWrapper addMoreSpacingToIcons={!!addMoreSpacingToIcons} shouldHaveNoSpacing={noIcon}>
        <Icon testID="icon" variant={variant} iconComponent={iconComponent} />
      </IconWrapper>
      <BottomLine testID="bottom-line" isFirst={isFirst} isLast={isLast} variant={variant} />
    </Wrapper>
  )
}

const Wrapper = styled.View(({ theme }) => ({
  alignItems: 'center',
  flex: 1,
  minWidth: theme.designSystem.size.spacing.xxl, // we add a width for when no icon is present
  overflow: 'hidden',
}))

const FilledLine = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.border.default,
  width: 2,
  borderRadius: theme.designSystem.size.borderRadius.s,
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

interface IconWrapperProps {
  addMoreSpacingToIcons?: boolean
  shouldHaveNoSpacing?: boolean
}

const getVerticalSpacing = ({ addMoreSpacingToIcons, shouldHaveNoSpacing }: IconWrapperProps) => {
  if (addMoreSpacingToIcons) {
    return getSpacing(2.5)
  }
  if (shouldHaveNoSpacing) {
    return 0
  }
  return getSpacing(0.5)
}

const IconWrapper = styled.View<IconWrapperProps>((props) => ({
  marginVertical: getVerticalSpacing(props),
}))

const StepperValidateSuccess = styled(StepperValidate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.success,
  color2: theme.designSystem.color.icon.inverted,
  size: theme.designSystem.size.spacing.xxl,
}))``
