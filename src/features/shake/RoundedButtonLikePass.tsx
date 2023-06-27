import React, { useMemo } from 'react'
import { AccessibilityRole, Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close } from 'ui/svg/icons/Close'
import { Favorite } from 'ui/svg/icons/Favorite'
import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface Props {
  iconName: 'favorite' | 'close'
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
  if (iconName === 'close') return Close
  return Favorite
}

export const RoundedButtonLikePass = (props: Props) => {
  const Icon = getIcon(props.iconName)
  const { icons } = useTheme()

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
      <IconContainer>
        <Icon size={icons.sizes.standard} testID={`icon-${props.iconName}`} />
      </IconContainer>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  ...customFocusOutline({ color: theme.colors.black }),
}))

const IconContainer = styled(Animated.View)(({ theme }) => ({
  width: getSpacing(14),
  height: getSpacing(14),
  aspectRatio: '1',
  borderRadius: theme.buttons.roundedButton.size,
  backgroundColor: theme.colors.white,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.colors.greyDark,
}))
