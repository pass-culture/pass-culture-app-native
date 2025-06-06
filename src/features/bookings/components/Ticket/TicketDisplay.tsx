import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Stroke } from 'ui/svg/Stroke'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing } from 'ui/theme'

export const TICKET_SEPARATION_HEIGHT = getSpacing(21.5)
const TICKET_FULL_MIDDLE_HEIGHT = getSpacing(8)

type TicketContentProps = {
  bottomContent: React.JSX.Element
  topContent: React.JSX.Element
  infoBanner?: React.JSX.Element
  display: 'punched' | 'full'
  onTopBlockLayout?: (height: number) => void
}

export const TicketDisplay = ({
  infoBanner,
  bottomContent,
  topContent,
  display,
  onTopBlockLayout,
}: TicketContentProps) => {
  return display === 'punched' ? (
    <View testID="ticket-punched">
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
        {bottomContent}
      </BottomBlock>
    </View>
  ) : (
    <FullBlock testID="ticket-full">
      <View
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          onTopBlockLayout?.(height)
        }}>
        {topContent}
      </View>
      <FullContainerStrokedLine>
        <StyledStrokedLine />
      </FullContainerStrokedLine>
      {infoBanner}
      {bottomContent}
    </FullBlock>
  )
}

const FullContainerStrokedLine = styled.View(({ theme }) => ({
  height: TICKET_FULL_MIDDLE_HEIGHT,
  backgroundColor: theme.designSystem.color.background.default,
}))

const ContainerStrokedLine = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
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

const FullBlock = styled(ContentBlock)({
  borderRadius: getSpacing(6),
  paddingVertical: getSpacing(6),
})

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
