import React, { FunctionComponent } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'

interface Props {
  step: StepDetails
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
}

export const StepButton = ({ step, navigateTo, onPress }: Props) => {
  const label = step.title
  const stepState = step.stepState
  const Icon = step.icon[stepState]
  const subtitle = step.subtitle

  let iconLabel = ''

  switch (stepState) {
    case StepButtonState.COMPLETED:
      iconLabel = 'complété'
      break
    case StepButtonState.CURRENT:
      iconLabel = 'non complété'
      break
    case StepButtonState.DISABLED:
      iconLabel = 'non complété'
      break
    case StepButtonState.RETRY:
      iconLabel = 'à essayer de nouveau'
      break
  }

  const accessibilityLabel = `${label} ${iconLabel}`

  const isDisabled =
    stepState === StepButtonState.DISABLED ||
    stepState === StepButtonState.COMPLETED ||
    (!navigateTo && !onPress)

  return navigateTo ? (
    <StyledInternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}>
      <ButtonContent stepState={stepState} label={label} subtitle={subtitle} Icon={Icon} />
    </StyledInternalTouchableLink>
  ) : (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}>
      <ButtonContent
        stepState={stepState}
        label={label}
        subtitle={subtitle}
        Icon={Icon}
        withRightIcon={!!onPress}
      />
    </StyledTouchableOpacity>
  )
}

type ButtonContentProps = {
  stepState: StepButtonState
  label: string
  subtitle?: string
  Icon: FunctionComponent<AccessibleIcon>
  withRightIcon?: boolean
}

const ButtonContent: FunctionComponent<ButtonContentProps> = ({
  stepState,
  label,
  subtitle,
  Icon,
  withRightIcon = true,
}) => {
  const StyleContainer = styleContainer[stepState]

  return (
    <StyleContainer LeftIcon={<Icon />} RightIcon={withRightIcon ? undefined : () => null}>
      <StyledButtonText stepState={stepState}>{label}</StyledButtonText>
      {subtitle ? <StepSubtitle stepState={stepState}>{subtitle}</StepSubtitle> : null}
    </StyleContainer>
  )
}

const BaseStyleComponent = styled(View)(({ theme }) => ({
  marginTop: getSpacing(2),
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.radius,
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: '1px',
}))

type BaseContainerProps = {
  children: React.ReactNode
  LeftIcon?: React.ReactElement
  style?: StyleProp<ViewStyle>
}
const BaseContainer: FunctionComponent<BaseContainerProps> = ({ LeftIcon, style, children }) => (
  <BaseStyleComponent style={style}>
    {LeftIcon ? <IconContainer>{LeftIcon}</IconContainer> : null}
    <ChildrenContainer>{children}</ChildrenContainer>
  </BaseStyleComponent>
)

const CurrentContainer = styled(GenericBanner)(({ theme }) => ({
  minHeight: getSpacing(23),
  borderColor: theme.colors.black,
}))

const RetryContainer = styled(GenericBanner)(({ theme }) => ({
  minHeight: getSpacing(23),
  borderColor: theme.colors.black,
}))

const DisabledContainer = styled(BaseContainer)(({ theme }) => ({
  minHeight: getSpacing(22),
  width: '98%',
  borderColor: theme.colors.greyMedium,
  paddingVertical: getSpacing(4),
  paddingRight: getSpacing(4),
}))

const CompletedContainer = styled(DisabledContainer)(({ theme }) => ({
  borderColor: theme.colors.greyLight,
  borderWidth: '2px',
}))

const styleContainer: Record<StepButtonState, React.ElementType> = {
  [StepButtonState.COMPLETED]: CompletedContainer,
  [StepButtonState.CURRENT]: CurrentContainer,
  [StepButtonState.DISABLED]: DisabledContainer,
  [StepButtonState.RETRY]: RetryContainer,
}

const IconContainer = styled.View({ padding: getSpacing(4) })

const ChildrenContainer = styled.View({
  flexDirection: 'column',
  flex: 1,
  paddingRight: getSpacing(4),
})

const StyledInternalTouchableLink: typeof InternalTouchableLink = styled(InternalTouchableLink)({
  width: '100%',
  justifyContent: 'center',
  flexDirection: 'row',
})

const StyledTouchableOpacity = styled(TouchableOpacity)({
  width: '100%',
  justifyContent: 'center',
  flexDirection: 'row',
})

const StyledButtonText = styled(TypoDS.BodyAccent)<{ stepState: StepButtonState }>(
  ({ stepState, theme }) => ({
    color:
      stepState === StepButtonState.CURRENT || stepState === StepButtonState.RETRY
        ? theme.colors.black
        : theme.colors.greyDark,
  })
)

const StepSubtitle = styled(TypoDS.BodyAccentXs)<{ stepState: StepButtonState }>(
  ({ stepState, theme }) => ({
    color:
      stepState === StepButtonState.CURRENT || stepState === StepButtonState.RETRY
        ? theme.colors.greyDark
        : theme.colors.greySemiDark,
  })
)
