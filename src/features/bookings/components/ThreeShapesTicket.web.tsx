import React, { PropsWithChildren } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { ColorsEnum, getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  width?: number
}>

const TICKET_MAX_WIDTH = 300

export function ThreeShapesTicket(props: Props) {
  const windowWidth = useWindowDimensions().width
  const defaultWidth = Math.min(TICKET_MAX_WIDTH, windowWidth - getSpacing(15))
  const width = props.width || defaultWidth
  return (
    <Container testID="three-shapes-ticket">
      <TicketHeader width={width} color={ColorsEnum.WHITE} />
      <TicketContent width={width}>{props.children}</TicketContent>
      <TicketFooter width={width} color={ColorsEnum.WHITE} />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const TicketContent = styled.View<{ width: number }>(({ width }) => ({
  backgroundColor: ColorsEnum.WHITE,
  width,
  flex: 0,
  flexBasis: 'unset',
}))
