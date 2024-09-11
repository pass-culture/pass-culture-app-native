import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'
import { EventCard, EventCardProps } from 'ui/components/eventCard/EventCard'

describe('EventCard', () => {
  const defaultEventCardProps: EventCardProps = {
    onPress: jest.fn(),
    isDisabled: false,
    title: 'Film 1',
    subtitleLeft: '19h00',
    subtitleRight: 'VO',
  }

  describe('analytics', () => {
    it('should send log ConsultOffer event when on venue page and user clicks on an eventCard', async () => {
      render(<EventCard {...defaultEventCardProps} analyticsFrom="venue" offerId={1} />)
      const eventCard = await screen.findByLabelText('Film 1')
      fireEvent.press(eventCard)

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        offerId: 1,
        from: 'venue',
      })
    })

    it('should not send log ConsultOffer event when not on venue page and user clicks on an eventCard', async () => {
      render(<EventCard {...defaultEventCardProps} analyticsFrom="offer" offerId={1} />)
      const eventCard = await screen.findByLabelText('Film 1')
      fireEvent.press(eventCard)

      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })
})
