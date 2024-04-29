import React from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
}

export const ToggleButton = ({
  active,
  onPress,
  label,
  accessibilityLabel,
  Icon,
}: ToggleButtonProps) => (
  <StyledTouchableOpacity
    accessibilityLabel={active ? accessibilityLabel.active : accessibilityLabel.inactive}
    onPress={onPress}>
    {active ? <Icon.active /> : <Icon.inactive />}
    <Spacer.Row numberOfSpaces={2} />
    <Typo.Caption>{active ? label.active : label.inactive}</Typo.Caption>
  </StyledTouchableOpacity>
)

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  borderColor: theme.colors.greySemiDark,
  borderWidth: getSpacing(0.25),
  borderRadius: getSpacing(6),
  paddingHorizontal: getSpacing(3),
  paddingVertical: getSpacing(1),
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: theme.colors.white,
}))
