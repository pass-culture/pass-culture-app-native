import React from 'react'

import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { render, screen } from 'tests/utils'

const offerDate = new Date(2022, 11, 17)

jest.mock('features/auth/helpers/useIsMailAppAvailableIOS', () => ({
  useIsMailAppAvailableIOS: jest.fn(() => true),
}))

describe('<EmailSent/>', () => {
  it('should display the button "Consulter mes e-mails"', () => {
    render(<EmailSent offerDate={offerDate} />)

    expect(screen.queryByTestId('Consulter mes e-mails')).toBeOnTheScreen()
  })
})
