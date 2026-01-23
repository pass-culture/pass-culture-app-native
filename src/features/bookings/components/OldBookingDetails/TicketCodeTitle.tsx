import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo } from 'ui/theme'

export const TicketCodeTitle = ({
  accessibilityLabel,
  onPress,
  children,
}: {
  accessibilityLabel?: string
  onPress?: () => void
  children: ReactNode
}) => (
  <StyledTouchable accessibilityLabel={accessibilityLabel} onPress={onPress} disabled={!onPress}>
    <StyledTitle>{children}</StyledTitle>
  </StyledTouchable>
)

const StyledTitle = styled(Typo.Title2)(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
}))

const StyledTouchable = styledButton(Touchable).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.designSystem.color.text.brandPrimary,
}))(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
  alignSelf: 'center',
}))
