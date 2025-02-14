import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Stroke } from 'ui/svg/Stroke'
import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'
import { getShadow, getSpacing, TypoDS } from 'ui/theme'

type Props = {
  title: string
  hour: string
  day: string
  isDuo?: boolean
  children: React.JSX.Element
  infoBanner?: React.JSX.Element
  venueInfo?: React.JSX.Element
}

export const TicketCutout = ({
  day,
  hour,
  isDuo,
  title,
  infoBanner,
  children,
  venueInfo,
}: Props) => {
  return (
    <View testID="ticket-punched">
      <TopBlock>
        <ViewGap gap={6}>
          <TypoDS.Title2>{title}</TypoDS.Title2>
          <ViewGap gap={2}>
            <Row>
              <StyledCalendarS />
              <TypoDS.Body>{day}</TypoDS.Body>
            </Row>
            <Row>
              <StyledClockFilled />
              <TypoDS.Body>{hour}</TypoDS.Body>
            </Row>
            {isDuo ? (
              <Row>
                <StyledStock />
                <TypoDS.Body>Pour deux personnes</TypoDS.Body>
              </Row>
            ) : null}
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

const StyledStrokedLine = styled(Stroke).attrs(({ theme }) => ({
  size: '100%',
  color: theme.colors.greyMedium,
}))({})

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
})

const ContentBlock = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(6),
  marginHorizontal: getSpacing(6),
  backgroundColor: 'white',
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
})
const TopBlock = styled(ContentBlock)({
  borderTopLeftRadius: getSpacing(6),
  borderTopRightRadius: getSpacing(6),
})
