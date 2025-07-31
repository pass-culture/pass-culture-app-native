import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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

const StyledTitle = styled(Typo.Title4).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
}))

const StyledTouchable = styledButton(Touchable).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.designSystem.color.text.brandPrimary,
}))(({ theme }) => ({
  alignSelf: 'center',
  justifyItems: 'center',
  padding: theme.designSystem.size.spacing.s,
  borderColor: theme.designSystem.color.border.brandPrimary,
  borderWidth: '1px',
  borderStyle: 'dashed',
  borderRadius: getSpacing(1),
}))
