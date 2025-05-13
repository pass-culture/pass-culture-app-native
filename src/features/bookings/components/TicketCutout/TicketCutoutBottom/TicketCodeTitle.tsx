import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'

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
  color: theme.colors.primary,
  padding: getSpacing(2),
  flexShrink: 0,
}))

const StyledTouchable = styledButton(Touchable).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.primary,
}))({
  alignSelf: 'center',
})
