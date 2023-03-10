import React from 'react'
import waitForExpect from 'wait-for-expect'

import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { render, screen } from 'tests/utils/web'

const offerDate = new Date(2022, 11, 17)

describe('<EmailSent/>', () => {
  it('should not display the button "Consulter mes e-mails"', async () => {
    render(<EmailSent offerDate={offerDate} />)
    await waitForExpect(() => {
      expect(screen.queryByTestId('Consulter mes e-mails')).toBeFalsy()
    })
  })
})
