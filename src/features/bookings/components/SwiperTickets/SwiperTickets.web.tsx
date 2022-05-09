import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import {
  getMultipleTickets,
  TicketsProps,
} from 'features/bookings/components/SwiperTickets/getMultipleTickets'
import { SwiperTicketsControls } from 'features/bookings/components/SwiperTickets/SwiperTicketsControls'
import { getSpacing } from 'ui/theme'

const MARGIN_HORIZONTAL = getSpacing(2)

export function SwiperTickets({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  const theme = useTheme()
  const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = booking.externalBookingsInfos?.length ?? 0
  const TICKET_WIDTH = theme.ticket.maxWidth + MARGIN_HORIZONTAL * 2
  const TOTAL_TICKETS_WIDTH = TICKET_WIDTH * NUMBER_OF_TICKETS

  const APP_CONTENT_WIDTH_WITH_MARGIN = theme.appContentWidth * 0.9
  const showControls = APP_CONTENT_WIDTH_WITH_MARGIN < TOTAL_TICKETS_WIDTH && NUMBER_OF_TICKETS > 1

  const DEFAULT_TRANSLATION_VALUE = (TOTAL_TICKETS_WIDTH - TICKET_WIDTH) / 2
  const [translateValue, setTranslateValue] = useState(DEFAULT_TRANSLATION_VALUE)

  const moveTo = (direction: 'next' | 'prev') => {
    if (direction === 'prev') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
        setTranslateValue(translateValue + TICKET_WIDTH)
      }
    } else {
      if (currentIndex !== NUMBER_OF_TICKETS && currentIndex > 0) {
        setCurrentIndex(currentIndex + 1)
        setTranslateValue(translateValue - TICKET_WIDTH)
      }
    }
  }

  return (
    <Container>
      <TicketsContainer>
        {tickets.map((ticket) => (
          <Ticket key={ticket.key} showControls={showControls} translateValue={translateValue}>
            {ticket}
          </Ticket>
        ))}
      </TicketsContainer>
      {!!showControls && (
        <SwiperTicketsControls
          numberOfSteps={NUMBER_OF_TICKETS}
          currentStep={currentIndex}
          prevTitle={t`Revenir au ticket précédent`}
          nextTitle={t`Voir le ticket suivant`}
          onPressPrev={() => moveTo('prev')}
          onPressNext={() => moveTo('next')}
        />
      )}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingVertical: getSpacing(2),
})

const Ticket = styled.View<{ showControls: boolean; translateValue: number }>(
  ({ showControls, translateValue }) => {
    const length = showControls ? translateValue : 0
    return {
      marginHorizontal: MARGIN_HORIZONTAL,
      transition: 'transform 0.2s ease-out',
      transform: `translateX(${length}px)`,
    }
  }
)
