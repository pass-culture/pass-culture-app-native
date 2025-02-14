import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingOfferResponseAddress, BookingVenueResponse } from 'api/gen'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Stroke } from 'ui/svg/Stroke'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing, TypoDS } from 'ui/theme'

type Props = {
  offerId: number
  title: string
  hour: string
  day: string
  isDuo?: boolean
  shouldDisplayItineraryButton?: boolean
  offerFullAddress?: string
  venue: BookingVenueResponse
  address: BookingOfferResponseAddress | null | undefined
  children: React.JSX.Element
  infoBanner?: React.JSX.Element
  venuInfo?: React.JSX.Element
}
const VENUE_THUMBNAIL_SIZE = getSpacing(15)

export const TicketCutout = ({
  day,
  hour,
  isDuo,
  title,
  shouldDisplayItineraryButton,
  offerFullAddress,
  venue,
  address,
  offerId,
  infoBanner,
  children,
  venueInfo,
}: Props) => {
  return (
    <View testID="ticket-punched">
      <TopBlock>
        <StyledViewGap gap={6}>
          <TypoDS.Title2>{title}</TypoDS.Title2>
          <ViewGap gap={2}>
            <StyledView>
              <StyledCalendarS />
              <TypoDS.Body>{day}</TypoDS.Body>
            </StyledView>
            <StyledView>
              <StyledClockFilled />
              <TypoDS.Body>{hour}</TypoDS.Body>
            </StyledView>
            {isDuo ? (
              <StyledView>
                <StyledStock />
                <TypoDS.Body>Pour deux personnes</TypoDS.Body>
              </StyledView>
            ) : null}
          </ViewGap>
          {venuInfo}
        </StyledViewGap>
      </TopBlock>
      <MiddleBlock>
        <TicketCutoutLeft />
        <ContainerStrokedLine>
          <StyledStroke />
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

const MiddleBlock = styled.View({
  flexDirection: 'row',
  width: '100%',
  height: getSpacing(21.5),
  backgroundColor: 'white',
  zIndex: 1,
})
const ContainerStrokedLine = styled.View({
  flex: 1,
})
const StyledStroke = styled(Stroke).attrs(({ theme }) => ({
  size: '100%',
  color: theme.colors.greyMedium,
}))``

const StyledClockFilled = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
const StyledCalendarS = styled(CalendarS).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledStock = styled(Stock).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledView = styled.View({
  flexDirection: 'row',
  gap: getSpacing(2),
  alignContent: 'center',
})

const StyledViewGap = styled(ViewGap)({
  paddingHorizontal: getSpacing(7.6),
})

const ContentBlock = styled.View(({ theme }) => {
  const shadows = getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(10),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.12,
  })
  return {
    paddingVertical: getSpacing(6),
    marginHorizontal: getSpacing(6),
    backgroundColor: 'white',
    gap: getSpacing(6),
    ...shadows,
  }
})
const BottomBlock = styled(ContentBlock)({
  borderBottomLeftRadius: getSpacing(6),
  borderBottomRightRadius: getSpacing(6),
  paddingHorizontal: getSpacing(7.6),
  justifyContent: 'center',
})
const TopBlock = styled(ContentBlock)({
  borderTopLeftRadius: getSpacing(6),
  borderTopRightRadius: getSpacing(6),
})
