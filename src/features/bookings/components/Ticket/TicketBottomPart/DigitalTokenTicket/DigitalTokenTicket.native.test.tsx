import React from 'react'

import { TokenResponse } from 'api/gen'
import { DigitalTokenTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTokenTicket/DigitalTokenTicket'
import { render, screen } from 'tests/utils'

describe('DigitalTokenTicket', () => {
  it('should not display anything when token is null', async () => {
    renderDigitalTokenTicket({ token: null })

    expect(screen.queryByTestId('digital-token-container')).not.toBeOnTheScreen()
  })

  it('should display container when token is present', async () => {
    renderDigitalTokenTicket({ token: { data: 'test-token' } })

    expect(screen.getByTestId('digital-token-container')).toBeOnTheScreen()
  })
})

const renderDigitalTokenTicket = ({ token }: { token: TokenResponse | null }) => {
  return render(<DigitalTokenTicket token={token} />)
}
