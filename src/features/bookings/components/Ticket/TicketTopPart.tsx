import React from 'react'
import styled from 'styled-components/native'

import { BookingOfferResponse } from 'api/gen'
import { LinkToOffer } from 'features/bookings/components/LinkToOffer'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Typo, getSpacing } from 'ui/theme'

type TicketTopPartProps = {
  title: string
  hour?: string
  day?: string
  isDuo?: boolean
  venueInfo?: React.JSX.Element
  offer: BookingOfferResponse
  mapping: SubcategoriesMapping
}

export const TicketTopPart = ({
  day,
  hour,
  isDuo,
  title,
  venueInfo,
  offer,
  mapping,
}: TicketTopPartProps) => {
  return (
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
  )
}

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

const Container = styled.View({
  marginLeft: getSpacing(1),
})
