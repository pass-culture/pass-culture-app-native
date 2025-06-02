import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Stroke } from 'ui/svg/Stroke'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing } from 'ui/theme'

export const TICKET_SEPARATION_HEIGHT = getSpacing(21.5)

type TicketContentProps = {
  infoBanner?: React.JSX.Element
  children: React.JSX.Element
  topContent: React.JSX.Element
  onTopBlockLayout?: (height: number) => void
}

export const TicketDisplay = ({
  infoBanner,
  children,
  topContent,
  onTopBlockLayout,
}: TicketContentProps) => {
  return (
    <View testID="booking-details-ticket">
      <TopBlock
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          onTopBlockLayout?.(height)
        }}>
        {topContent}
      </TopBlock>
      <MiddleBlock>
        <TicketCutoutLeft />
        <ContainerStrokedLine>
          <StyledStrokedLine />
        </ContainerStrokedLine>
        <TicketCutoutRight />
      </MiddleBlock>
      <BottomBlock>
        {infoBanner}
        {children}
      </BottomBlock>
    </View>
  )
}

const ContainerStrokedLine = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledStrokedLine = styled(Stroke).attrs(({ theme }) => ({
  size: '100%',
  color: theme.colors.greyMedium,
}))({})

const MiddleBlock = styled.View({
  flexDirection: 'row',
  width: '100%',
  height: TICKET_SEPARATION_HEIGHT,
  zIndex: 1,
})

const ContentBlock = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  backgroundColor: theme.designSystem.color.background.default,
  gap: getSpacing(6),
  paddingHorizontal: getSpacing(7.5),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(0.5),
    },
    shadowRadius: getSpacing(4),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const BottomBlock = styled(ContentBlock)({
  borderBottomLeftRadius: getSpacing(6),
  borderBottomRightRadius: getSpacing(6),
  justifyContent: 'center',
  paddingBottom: getSpacing(6),
})
const TopBlock = styled(ContentBlock)({
  borderTopLeftRadius: getSpacing(6),
  borderTopRightRadius: getSpacing(6),
  paddingTop: getSpacing(6),
})
