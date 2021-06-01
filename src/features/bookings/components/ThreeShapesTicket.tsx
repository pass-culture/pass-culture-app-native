import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { ColorsEnum, getNativeShadow } from 'ui/theme'

import { TICKET_WIDTH } from './ThreeShapesTicket.constants'

type ThreeShapesTicketProps = PropsWithChildren<{
  width?: number
}>

export function ThreeShapesTicket(props: ThreeShapesTicketProps) {
  const { width = TICKET_WIDTH, children } = props
  const contentWidth = width - 5

  return (
    <Container style={shadowStyle} testID="three-shapes-ticket">
      <TicketHeader width={width} color={ColorsEnum.WHITE} />
      <TicketContent width={contentWidth}>{children}</TicketContent>
      <TicketFooter width={width} color={ColorsEnum.WHITE} />
    </Container>
  )
}

const shadowStyle = {
  ...getNativeShadow({
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.1,
  }),
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
}))
