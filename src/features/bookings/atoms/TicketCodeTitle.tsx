import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Typo } from 'ui/theme'

export const TicketCodeTitle = ({
  onPress,
  children,
}: {
  onPress?: () => void
  children: ReactNode
}) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
    <StyledTitle>{children}</StyledTitle>
  </TouchableOpacity>
)

const StyledTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  padding: getSpacing(2.5),
}))
