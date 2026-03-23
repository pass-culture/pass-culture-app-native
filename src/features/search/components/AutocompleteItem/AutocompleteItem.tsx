import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

type Props = {
  icon: React.ReactNode
  onPress: () => void
  children: React.ReactNode
  testID?: string
}

export function AutocompleteItem({ icon, onPress, children, testID }: Props) {
  return (
    <ItemTouchable testID={testID} onPress={onPress} accessibilityRole={AccessibilityRole.BUTTON}>
      <IconWrapper>{icon}</IconWrapper>
      <Content numberOfLines={2} ellipsizeMode="tail">
        {children}
      </Content>
    </ItemTouchable>
  )
}

const IconWrapper = styled.View({ flexShrink: 0 })

const ItemTouchable = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Content = styled.Text(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
}))
