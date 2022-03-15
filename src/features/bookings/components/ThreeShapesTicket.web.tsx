import React, { PropsWithChildren } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  width?: number
}>

export function ThreeShapesTicket(props: Props) {
  const { appContentWidth, ticket, colors } = useTheme()
  const defaultWidth = Math.min(ticket.maxWidth, appContentWidth - getSpacing(15))
  const width = props.width || defaultWidth
  return (
    <Container testID="three-shapes-ticket">
      <TicketHeader width={width} color={colors.white} />
      <TicketContent width={width}>{props.children}</TicketContent>
      <TicketFooter width={width} color={colors.white} />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const TicketContent = styled.View<{ width: number }>(({ width, theme }) => ({
  top: -3,
  marginBottom: -6,
  backgroundColor: theme.colors.white,
  width,
  flex: 0,
  flexBasis: 'unset',
  borderLeftWidth: 2,
  borderRightWidth: 2,
  borderColor: theme.colors.greyLight,
}))
