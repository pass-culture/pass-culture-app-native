import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Stock } from 'ui/svg/icons/Stock'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing, TypoDS } from 'ui/theme'

type Props = {
  topChildren: ReactElement
  bottomChildren: ReactElement
  testID?: string
  title: string
  date: string
  hour: string
  duo?: boolean
  venueTitle: string
  venueAdress: string
  venueImageURL: string
}
const VENUE_THUMBNAIL_SIZE = getSpacing(14)

export const WipTicketBody = (props: Props) => {
  return (
    <Container testID={props.testID ?? 'ticket-punched'}>
      <TopBlock>
        <StyledViewGap gap={6}>
          <TypoDS.Title2>{props.title}</TypoDS.Title2>
          <ViewGap gap={2}>
            <StyledView>
              <StyledCalendarS />
              <TypoDS.Body>{props.date}</TypoDS.Body>
            </StyledView>
            <StyledView>
              <StyledClockFilled />
              <TypoDS.Body>{props.hour}</TypoDS.Body>
            </StyledView>
            {props.duo ? (
              <StyledView>
                <StyledStock />
                <TypoDS.Body>Pour deux personnes</TypoDS.Body>
              </StyledView>
            ) : null}
          </ViewGap>
          <VenueInfoHeader
            title={props.venueTitle}
            showArrow
            subtitle={props.venueAdress}
            imageURL={props.venueImageURL}
            imageSize={VENUE_THUMBNAIL_SIZE}
          />
        </StyledViewGap>
      </TopBlock>
      <MiddleBlock>
        <TicketCutoutLeft />
        <StrokedLine />
        <TicketCutoutRight />
      </MiddleBlock>
      <BottomBlock>
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={GreyIdCard}
        />
        {props.bottomChildren}
      </BottomBlock>
    </Container>
  )
}

const MiddleBlock = styled.View({
  flexDirection: 'row',
  width: '100%',
  height: getSpacing(21.5),
})
const StrokedLine = styled.View({
  backgroundColor: 'blue',
  flex: 1,
  width: '100%',
})

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

const GreyIdCard = styled(IdCard).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
}))``

const Container = styled.View({
  /*   flexWrap: 'wrap',
  flexDirection: 'column',
  justifyContent: 'center',
  width: 327, */
})

/* const HideBottomShadow = styled.View({
  marginBottom: -getSpacing(1),
  height: getSpacing(4),
  backgroundColor: 'white',
  width: '100%',
})
 */
const ContentBlock = styled.View(({ theme }) => {
  const shadows = getShadow({
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
  })

  return {
    paddingVertical: getSpacing(6),
    marginHorizontal: getSpacing(6),
    backgroundColor: 'white',
    ...shadows,
  }
})
const TopBlock = styled(ContentBlock)({
  borderTopLeftRadius: getSpacing(6),
  borderTopRightRadius: getSpacing(6),
  /* justifyContent: 'flex-end', */
  gap: getSpacing(6),
})
const BottomBlock = styled(ContentBlock)({
  borderBottomLeftRadius: getSpacing(6),
  borderBottomRightRadius: getSpacing(6),
  gap: getSpacing(6),
  paddingHorizontal: getSpacing(7.6),
})
