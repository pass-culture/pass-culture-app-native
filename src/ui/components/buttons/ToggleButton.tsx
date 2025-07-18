import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Typo } from 'ui/theme'

export enum ToggleButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
}

type Activable<T> = {
  active: T
  inactive: T
}

type ToggleButtonProps = {
  active: boolean
  onPress: () => void
  label: Activable<string>
  accessibilityLabel: Activable<string>
  Icon: Activable<React.FC>
  isFlex?: boolean
  size?: ToggleButtonSize
}

export const ToggleButton = ({
  active,
  onPress,
  label,
  accessibilityLabel,
  Icon,
  isFlex,
  size = ToggleButtonSize.MEDIUM,
}: ToggleButtonProps) => {
  const TouchableComponent = isFlex ? FlexTouchableOpacity : StaticTouchableOpacity

  return (
    <TouchableComponent
      accessibilityRole={AccessibilityRole.BUTTON}
      size={size}
      accessibilityLabel={active ? accessibilityLabel.active : accessibilityLabel.inactive}
      onPress={onPress}>
      {active ? <Icon.active /> : <Icon.inactive />}
      {size === ToggleButtonSize.MEDIUM ? (
        <LabelText>{active ? label.active : label.inactive}</LabelText>
      ) : null}
    </TouchableComponent>
  )
}

const BaseTouchableOpacity = styled(TouchableOpacity)<{ size: ToggleButtonSize }>(({
  theme,
  size,
}) => {
  const isMedium = size === ToggleButtonSize.MEDIUM

  return {
    borderColor: isMedium
      ? theme.designSystem.color.border.default
      : theme.designSystem.color.border.inverted,
    borderWidth: getSpacing(0.25),
    borderRadius: isMedium ? getSpacing(6) : theme.buttons.roundedButton.size / 2,
    paddingHorizontal: isMedium ? getSpacing(3) : 0,
    paddingVertical: isMedium ? getSpacing(1) : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: isMedium ? theme.designSystem.color.background.default : 'transparent',
    width: isMedium ? 'auto' : theme.buttons.roundedButton.size,
    height: isMedium ? 'auto' : theme.buttons.roundedButton.size,
  }
})

const FlexTouchableOpacity = styled(BaseTouchableOpacity)({
  flex: 1,
  justifyContent: 'center',
})

const StaticTouchableOpacity = styled(BaseTouchableOpacity)({})

const LabelText = styled(Typo.BodyAccentXs)({
  marginLeft: getSpacing(2),
})
