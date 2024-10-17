import React from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

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
}

export const ToggleButton = ({
  active,
  onPress,
  label,
  accessibilityLabel,
  Icon,
  isFlex,
}: ToggleButtonProps) => {
  const TouchableComponent = isFlex ? FlexTouchableOpacity : StaticTouchableOpacity

  return (
    <TouchableComponent
      accessibilityLabel={active ? accessibilityLabel.active : accessibilityLabel.inactive}
      onPress={onPress}>
      {active ? <Icon.active /> : <Icon.inactive />}
      <Spacer.Row numberOfSpaces={2} />
      <TypoDS.BodyAccentXs>{active ? label.active : label.inactive}</TypoDS.BodyAccentXs>
    </TouchableComponent>
  )
}

const BaseTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
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

const FlexTouchableOpacity = styled(BaseTouchableOpacity)({
  flex: 1,
  justifyContent: 'center',
})

const StaticTouchableOpacity = styled(BaseTouchableOpacity)({})
