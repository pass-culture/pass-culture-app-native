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
  const { ticket, appContentWidth } = useTheme()
  const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = booking.externalBookingsInfos?.length ?? 0
  const TICKET_WIDTH = ticket.maxWidth + MARGIN_HORIZONTAL * 2
  const TOTAL_TICKETS_WIDTH = TICKET_WIDTH * NUMBER_OF_TICKETS

  const APP_CONTENT_WIDTH_WITH_MARGIN = appContentWidth * 0.9
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
    <React.Fragment>
      <Container>
        {tickets[0].map((ticket) => (
          <TicketsContainer
            key={ticket.key}
            showControls={showControls}
            translateValue={translateValue}>
            {ticket}
          </TicketsContainer>
        ))}
      </Container>
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
    </React.Fragment>
  )
}

const Container = styled.View({
  flexDirection: 'row',
})

const TicketsContainer = styled.View<{ showControls: boolean; translateValue: number }>(
  ({ showControls, translateValue }) => {
    const length = showControls ? translateValue : 0
    return {
      marginHorizontal: MARGIN_HORIZONTAL,
      transition: 'transform 0.2s ease-out',
      transform: `translateX(${length}px)`,
    }
  }
)
