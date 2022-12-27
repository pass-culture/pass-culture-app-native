import React from 'react'
import waitForExpect from 'wait-for-expect'

import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { render } from 'tests/utils'

const offerDate = new Date(2022, 11, 17)

describe('<EmailSent/>', () => {
  it('should display the button "Consulter mes e-mails"', async () => {
    const { queryByTestId } = render(<EmailSent offerDate={offerDate} />)
    await waitForExpect(() => {
      expect(queryByTestId('Consulter mes e-mails')).toBeTruthy()
    })
  })
})
