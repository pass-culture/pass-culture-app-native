import React, { PropsWithChildren, useState } from 'react'
import { LayoutRectangle } from 'react-native'
import styled from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { ColorsEnum, getNativeShadow } from 'ui/theme'

type ThreeShapesTicketProps = PropsWithChildren<{
  color?: ColorsEnum
  width: number
}>

export function ThreeShapesTicket(props: ThreeShapesTicketProps) {
  const [headerDimensions, setHeaderDimensions] = useState<LayoutRectangle | undefined>()
  return (
    <Container customWitdh={props.width} style={shaddowStyle}>
      <TicketHeader
        width={props.width}
        color={props.color}
        onLayout={(e) => setHeaderDimensions(e.nativeEvent.layout)}
      />
      {headerDimensions && (
        <CenterView customWitdh={headerDimensions?.width} color={props.color}>
          {props.children}
        </CenterView>
      )}
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

const CenterView = styled.View<{ customWitdh: number; color?: ColorsEnum }>(
  ({ customWitdh, color }) => ({
    width: customWitdh,
    backgroundColor: color,
    minHeight: 300, // FIXME(PC-7471) adapt height to content
  })
)
