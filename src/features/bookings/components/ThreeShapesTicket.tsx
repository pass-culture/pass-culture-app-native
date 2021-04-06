import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { ColorsEnum, getNativeShadow } from 'ui/theme'

type ThreeShapesTicketProps = PropsWithChildren<{
  color?: ColorsEnum
  width: number
}>

export function ThreeShapesTicket(props: ThreeShapesTicketProps) {
  return (
    <Container customWitdh={props.width} style={shaddowStyle}>
      <TicketHeader width={props.width} color={props.color} />
      <CenterView color={props.color}>{props.children}</CenterView>
      <TicketFooter width={props.width} color={props.color} />
    </Container>
  )
}

const shaddowStyle = {
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

const Container = styled.View<{ customWitdh: number; color?: ColorsEnum }>(({ customWitdh }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: customWitdh,
}))

const CenterView = styled.View<{ color?: ColorsEnum }>(({ color }) => ({
  width: '100%',
  backgroundColor: color,
}))
