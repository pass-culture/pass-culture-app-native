import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { SwipperTicketsControls } from 'features/bookings/components/SwipperTicketsControls'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { getSpacing } from 'ui/theme'

type Props = {
  booking: BookingReponse[]
  activationCodeFeatureEnabled?: boolean
}

const MARGIN_HORIZONTAL = getSpacing(2)

export function SwipperTickets({ booking, activationCodeFeatureEnabled }: Props) {
  // TODO :
  // ?. Déteccter si web touch > Afficher le composant native ?
  const { ticket, appContentWidth } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = booking.length
  const TICKET_WIDTH = ticket.maxWidth + MARGIN_HORIZONTAL * 2
  const TOTAL_TICKETS_WIDTH = TICKET_WIDTH * NUMBER_OF_TICKETS

  const APP_CONTENT_WIDTH_WITH_MARGIN = appContentWidth * 0.9
  const showControls = APP_CONTENT_WIDTH_WITH_MARGIN < TOTAL_TICKETS_WIDTH && NUMBER_OF_TICKETS > 1

  const DEFAULT_TRANSLATION_VALUE = (TOTAL_TICKETS_WIDTH - TICKET_WIDTH) / 2
  const [translateValue, setTranslateValue] = useState(DEFAULT_TRANSLATION_VALUE)

  const moveTo = (direction: 'next' | 'prev') => {
    if (direction === 'prev') {
      if (currentIndex > 0) {
        setCurrentIndex((state) => (state -= 1))
        setTranslateValue((state) => (state += TICKET_WIDTH))
      }
    } else {
      if (currentIndex !== NUMBER_OF_TICKETS && currentIndex > 0) {
        setCurrentIndex((state) => (state += 1))
        setTranslateValue((state) => (state -= TICKET_WIDTH))
      }
    }
  }

  return (
    <React.Fragment>
      <Container>
        {booking.map((item) => (
          <TicketsContainer
            key={item.id}
            showControls={showControls}
            translateValue={translateValue}>
            <ThreeShapesTicket>
              <BookingDetailsTicketContent
                booking={item}
                activationCodeFeatureEnabled={activationCodeFeatureEnabled}
              />
            </ThreeShapesTicket>
          </TicketsContainer>
        ))}
      </Container>
      {!!showControls && (
        <SwipperTicketsControlsContainer>
          <SwipperTicketsControls
            numberOfSteps={NUMBER_OF_TICKETS}
            currentStep={currentIndex}
            prevTitle={t`Revenir au ticket précédent`}
            nextTitle={t`Voir le ticket suivant`}
            onPressPrev={() => moveTo('prev')}
            onPressNext={() => moveTo('next')}
          />
        </SwipperTicketsControlsContainer>
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

const SwipperTicketsControlsContainer = styled.View({
  marginVertical: getSpacing(5),
})
