import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type Props = {
  label: string
  Icon: FunctionComponent<AccessibleIcon>
  onPress: () => void
}

export const ThemeBubble: FunctionComponent<Props> = ({ label, Icon, onPress }) => {
  const { designSystem } = useTheme()

  return (
    <Container
      onPress={onPress}
      accessibilityRole={AccessibilityRole.BUTTON}
      accessibilityLabel={label}>
      <Bubble
        colors={[
          designSystem.color.background.decorative01,
          designSystem.color.background.decorative05,
        ]}>
        <Icon size={designSystem.size.icon.l} color={designSystem.color.icon.brandPrimary} />
      </Bubble>
      <Typo.BodyAccentS>{label}</Typo.BodyAccentS>
    </Container>
  )
}

const Container = styled(TouchableOpacity)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
}))

// Diagonal gradient, from the top left corner to the bottom right one
const Bubble = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.image.s,
  height: theme.designSystem.size.image.s,
  borderRadius: theme.designSystem.size.borderRadius.pill,
}))
