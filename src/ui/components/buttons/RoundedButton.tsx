import React, { useMemo } from 'react'
import { AccessibilityRole, Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { AnimatedIcon } from 'ui/components/AnimatedIcon'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Share } from 'ui/svg/icons/BicolorShare'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface Props {
  iconName: 'back' | 'share' | 'favorite' | 'favorite-filled'
  initialColor?: ColorsEnum
  finalColor?: ColorsEnum
  onPress: () => void
  scaleAnimatedValue?: Animated.Value
  animationState?: {
    iconBackgroundColor: Animated.AnimatedInterpolation
    iconBorderColor: Animated.AnimatedInterpolation
    transition: Animated.AnimatedInterpolation
  }
  accessibilityRole?: AccessibilityRole
  accessibilityChecked?: boolean
  accessibilityLabel?: string
  disabled?: boolean
}

const getIcon = (iconName: Props['iconName']): React.FC<IconInterface> => {
  if (iconName === 'back') return ArrowPrevious
  if (iconName === 'share') return Share
  if (iconName === 'favorite-filled') return FavoriteFilled
  return Favorite
}

export const RoundedButton = (props: Props) => {
  const Icon = getIcon(props.iconName)
  const { colors, icons } = useTheme()

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
            initialColor={props.initialColor || colors.black}
            testID={`animated-icon-${props.iconName}`}
            transition={props.animationState.transition}
            finalColor={props.finalColor || colors.black}
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
            testID={`icon-${props.iconName}`}
            color={props.finalColor || colors.black}
          />
        </IconContainer>
      )}
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  ...customFocusOutline({ color: theme.colors.black }),
}))

const IconContainer = styled(Animated.View)(({ theme }) => ({
  width: theme.buttons.roundedButton.size,
  height: theme.buttons.roundedButton.size,
  aspectRatio: '1',
  borderRadius: theme.buttons.roundedButton.size,
  backgroundColor: theme.colors.white,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.colors.greyLight,
}))
