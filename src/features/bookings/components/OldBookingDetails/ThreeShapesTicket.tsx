import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TicketFooter } from 'ui/svg/TicketFooter'
import { TicketHeader } from 'ui/svg/TicketHeader'
import { getShadow, getSpacing } from 'ui/theme'

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

const Container = styled.View(({ theme }) => {
  let shadows = {}
  if (!isWeb) {
    shadows = getShadow({
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 3,
      shadowColor: theme.colors.black,
      shadowOpacity: 0.1,
    })
  }
  return {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows,
  }
})

const TicketContent = styled.View<{ width: number }>(({ theme, width }) => {
  return {
    backgroundColor: theme.ticket.backgroundColor,
    width,
    alignItems: 'center',
    maxWidth: '100%',
    padding: getSpacing(2),
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.ticket.borderColor,
  }
})
