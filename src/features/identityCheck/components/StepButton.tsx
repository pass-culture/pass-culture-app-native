import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { StepButtonState, DeprecatedStepConfig, StepDetails } from 'features/identityCheck/types'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  step: DeprecatedStepConfig | StepDetails
  state: StepButtonState
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
}

export const StepButton = ({ step, state, navigateTo, onPress }: Props) => {
  const label = 'label' in step ? step.label : step.title
  const Icon = step.icon[state]

  const iconLabel = state === StepButtonState.COMPLETED ? 'Complété' : 'Non complété'
  const accessibilityLabel = `${label} ${iconLabel}`

  const StyleContainer = styleContainer[state]

  return navigateTo ? (
    <StyledInternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onPress}
      disabled={state !== 'current'}
      accessibilityLabel={accessibilityLabel}>
      <StyleContainer LeftIcon={Icon}>
        <StyledButtonText state={state}>{label}</StyledButtonText>
      </StyleContainer>
    </StyledInternalTouchableLink>
  ) : (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={state !== 'current'}
      accessibilityLabel={accessibilityLabel}>
      <StyleContainer LeftIcon={Icon}>
        <StyledButtonText state={state}>{label}</StyledButtonText>
      </StyleContainer>
    </StyledTouchableOpacity>
  )
}

const BaseStyleComponent = styled.View(({ theme }) => ({
  marginTop: getSpacing(2),
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.radius,
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: '1px',
}))

type BaseContainerProps = {
  LeftIcon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
}
const BaseContainer: FunctionComponent<BaseContainerProps> = ({ LeftIcon, style, children }) => (
  <BaseStyleComponent style={style}>
    {!!LeftIcon && (
      <IconContainer>
        <LeftIcon />
      </IconContainer>
    )}
    {children}
  </BaseStyleComponent>
)

const CurrentContainer = styled(GenericBanner)(({ theme }) => ({
  height: getSpacing(23),
  borderColor: theme.colors.black,
  marginTop: getSpacing(2),
}))

const DisabledContainer = styled(BaseContainer)(({ theme }) => ({
  height: getSpacing(22),
  width: '98%',
  borderColor: theme.colors.greyMedium,
}))

const CompletedContainer = styled(DisabledContainer)(({ theme }) => ({
  borderColor: theme.colors.greyLight,
  borderWidth: '2px',
}))

const styleContainer = {
  [StepButtonState.COMPLETED]: CompletedContainer,
  [StepButtonState.CURRENT]: CurrentContainer,
  [StepButtonState.DISABLED]: DisabledContainer,
}

const IconContainer = styled.View({ padding: getSpacing(4) })

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

const StyledButtonText = styled(Typo.ButtonText)<{ state: StepButtonState }>(
  ({ state, theme }) => ({
    color: state === StepButtonState.CURRENT ? theme.colors.black : theme.colors.greySemiDark,
  })
)
