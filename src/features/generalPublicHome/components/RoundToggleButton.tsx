import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = {
  Icon: FunctionComponent<AccessibleIcon>
  label: string
  checked: boolean
  onPress: () => void
}

export const RoundToggleButton: FunctionComponent<Props> = ({ Icon, label, checked, onPress }) => {
  const { designSystem } = useTheme()

  return (
    <Container checked={checked} onPress={onPress} {...accessibleCheckboxProps({ checked, label })}>
      <Icon
        size={designSystem.size.icon.m}
        color={checked ? designSystem.color.icon.inverted : designSystem.color.icon.brandPrimary}
      />
    </Container>
  )
}

const Container = styled(TouchableOpacity)<{ checked: boolean }>(({ theme, checked }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.spacing.xxxxl,
  height: theme.designSystem.size.spacing.xxxxl,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  borderWidth: 1.5,
  borderColor: checked
    ? theme.designSystem.color.border.brandPrimary
    : theme.designSystem.color.border.subtle,
  backgroundColor: checked
    ? theme.designSystem.color.background.brandPrimary
    : theme.designSystem.color.background.subtle,
}))
