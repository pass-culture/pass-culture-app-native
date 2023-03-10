import React from 'react'

import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { render, screen, waitFor } from 'tests/utils/web'

const offerDate = new Date(2022, 11, 17)

describe('<EmailSent/>', () => {
  it('should not display the button "Consulter mes e-mails"', async () => {
    render(<EmailSent offerDate={offerDate} />)
    await waitFor(() => {
      expect(screen.queryByTestId('Consulter mes e-mails')).toBeFalsy()
    })
  })
})
