import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingOfferResponse } from 'api/gen'
import { LinkToOffer } from 'features/bookings/components/LinkToOffer'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Stroke } from 'ui/svg/Stroke'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing, Typo } from 'ui/theme'

export const TICKET_SEPARATION_HEIGHT = getSpacing(21.5)

type Props = {
  title: string
  hour?: string
  day?: string
  isDuo?: boolean
  children: React.JSX.Element
  infoBanner?: React.JSX.Element
  venueInfo?: React.JSX.Element
  offer: BookingOfferResponse
  mapping: SubcategoriesMapping
  onTopBlockLayout?: (height: number) => void
}

export const TicketCutoutContent = ({
  day,
  hour,
  isDuo,
  title,
  infoBanner,
  children,
  venueInfo,
  offer,
  mapping,
  onTopBlockLayout,
}: Props) => {
  return (
    <View testID="ticket-punched">
      <TopBlock
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          onTopBlockLayout?.(height)
        }}>
        <ViewGap gap={6}>
          <Typo.Title2>{title}</Typo.Title2>
          <ViewGap gap={2}>
            {day ? (
              <Row>
                <StyledCalendarS />
                <Typo.Body>{day}</Typo.Body>
              </Row>
            ) : null}
            {hour ? (
              <Row>
                <StyledClockFilled />
                <Typo.Body>{hour}</Typo.Body>
              </Row>
            ) : null}
            {isDuo ? (
              <Row>
                <StyledStock />
                <Typo.Body>Pour deux personnes</Typo.Body>
              </Row>
            ) : null}
            <Container>
              <LinkToOffer offer={offer} mapping={mapping} />
            </Container>
          </ViewGap>
          {venueInfo}
        </ViewGap>
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

const StyledClockFilled = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})
const StyledCalendarS = styled(CalendarS).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})
const StyledStock = styled(Stock).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})

const Row = styled.View({
  flexDirection: 'row',
  gap: getSpacing(2),
  alignContent: 'center',
  justifyContent: 'flex-start',
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

const Container = styled.View({
  marginLeft: getSpacing(1),
})
