import React, { PropsWithChildren } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { getShadow, getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = PropsWithChildren<{
  width?: number
}>

const TICKET_MAX_WIDTH = 300

export function ThreeShapesTicket(props: Props) {
  const { appContentWidth } = useTheme()
  const defaultWidth = Math.min(TICKET_MAX_WIDTH, appContentWidth - getSpacing(15))
  const width = props.width || defaultWidth
  const contentWidth = width - 5
  return (
    <Container testID="three-shapes-ticket">
      <TicketHeader width={width} color={ColorsEnum.WHITE} />
      <TicketContent width={contentWidth}>{props.children}</TicketContent>
      <TicketFooter width={width} color={ColorsEnum.WHITE} />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.1,
  }),
})

const TicketContent = styled.View<{ width: number }>(({ width }) => ({
  backgroundColor: ColorsEnum.WHITE,
  width,
  flex: 0,
}))
