import React, { useMemo } from 'react'
import { AccessibilityRole, Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { ColorsType } from 'theme/types'
import { AnimatedIcon } from 'ui/components/AnimatedIcon'
import { styledButton } from 'ui/components/buttons/styledButton'
import { IconNames } from 'ui/components/icons/iconFactory'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { Touchable } from 'ui/components/touchable/Touchable'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface Props {
  iconName?: IconNames
  Icon?: React.FC<AccessibleIcon>
  initialColor?: ColorsType
  finalColor?: ColorsType
  onPress: () => void
  scaleAnimatedValue?: Animated.Value
  animationState?: {
    iconBackgroundColor: Animated.AnimatedInterpolation<ColorsType>
    iconBorderColor: Animated.AnimatedInterpolation<ColorsType>
    transition: Animated.AnimatedInterpolation<string | number>
  }
  accessibilityRole?: AccessibilityRole
  accessibilityChecked?: boolean
  accessibilityLabel?: string
  disabled?: boolean
}

export const RoundedButton = (props: Props) => {
  const iconFactory = useIconFactory()
  const Icon = props.Icon ?? iconFactory.getIcon(props.iconName)
  const { icons, designSystem } = useTheme()

  const accessibilityProps = useMemo(() => {
    return props.accessibilityRole
      ? accessibleCheckboxProps({
          checked: props.accessibilityChecked,
          label: props.accessibilityLabel,
        })
      : { accessibilityLabel: props.accessibilityLabel }
  }, [props.accessibilityRole, props.accessibilityChecked, props.accessibilityLabel])

  return (
    <StyledTouchable
      activeOpacity={0.5}
      onPress={props.onPress}
      disabled={props.disabled}
      {...accessibilityProps}>
      {props.animationState ? (
        <IconContainer
          testID="AnimatedHeaderIconRoundContainer"
          style={{
            borderColor: props.animationState.iconBorderColor,
            backgroundColor: props.animationState.iconBackgroundColor,
            transform: props.scaleAnimatedValue ? [{ scale: props.scaleAnimatedValue }] : undefined,
          }}>
          <AnimatedIcon
            Icon={Icon}
            initialColor={props.initialColor || designSystem.color.icon.default}
            testID={props.iconName ? `animated-icon-${props.iconName}` : undefined}
            transition={props.animationState.transition}
            finalColor={props.finalColor || designSystem.color.icon.default}
            size={icons.sizes.small}
          />
        </IconContainer>
      ) : (
        <IconContainer
          style={{
            transform: props.scaleAnimatedValue ? [{ scale: props.scaleAnimatedValue }] : undefined,
          }}>
          <Icon
            size={icons.sizes.small}
            testID={props.iconName ? `icon-${props.iconName}` : undefined}
            color={props.finalColor || designSystem.color.icon.default}
          />
        </IconContainer>
      )}
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  ...customFocusOutline({}),
}))

const IconContainer = styled(Animated.View)(({ theme }) => ({
  width: theme.buttons.roundedButton.size,
  height: theme.buttons.roundedButton.size,
  aspectRatio: '1',
  borderRadius: theme.buttons.roundedButton.size,
  backgroundColor: theme.designSystem.color.background.default,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.designSystem.color.border.default,
}))
