import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'

type Props = PropsWithChildren<{
  testID?: string
}>

const isWeb = Platform.OS === 'web'

export function ThreeShapesTicket(props: Props) {
  const { appContentWidth, ticket } = useTheme()
  const width = Math.min(ticket.maxWidth, appContentWidth * ticket.sizeRatio)
  const contentWidth = isWeb ? width : width - 5
  return (
    <Container testID={props.testID ?? 'three-shapes-ticket'}>
      <TicketHeader width={width} />
      <TicketContent width={contentWidth}>{props.children}</TicketContent>
      <TicketFooter width={width} />
    </Container>
  )
}

const Container = styled.View(() => ({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

const TicketContent = styled.View<{ width: number }>(({ theme, width }) => {
  return {
    backgroundColor: theme.designSystem.color.background.default,
    width,
    alignItems: 'center',
    maxWidth: '100%',
    padding: theme.designSystem.size.spacing.s,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.designSystem.color.border.subtle,
  }
})
