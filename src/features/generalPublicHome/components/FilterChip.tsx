import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Typo } from 'ui/theme'

type Props = {
  label: string
  isSelected: boolean
  onPress: () => void
}

export const FilterChip: FunctionComponent<Props> = ({ label, isSelected, onPress }) => (
  <Container
    isSelected={isSelected}
    onPress={onPress}
    accessibilityRole={AccessibilityRole.BUTTON}
    accessibilityLabel={label}
    aria-selected={isSelected}>
    <Label isSelected={isSelected}>{label}</Label>
  </Container>
)

const Container = styled(TouchableOpacity)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  justifyContent: 'center',
  height: theme.designSystem.size.spacing.xxxxl,
  paddingHorizontal: theme.designSystem.size.spacing.l,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  borderWidth: 1.5,
  borderColor: isSelected
    ? theme.designSystem.color.border.brandPrimary
    : theme.designSystem.color.border.subtle,
  backgroundColor: isSelected
    ? theme.designSystem.color.background.brandPrimary
    : theme.designSystem.color.background.default,
}))

const Label = styled(Typo.BodyAccentS)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  color: isSelected
    ? theme.designSystem.color.text.inverted
    : theme.designSystem.color.text.default,
}))
