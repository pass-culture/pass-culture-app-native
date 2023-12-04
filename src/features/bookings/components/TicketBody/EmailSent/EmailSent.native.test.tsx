import React from 'react'

import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { render, screen } from 'tests/utils'

const offerDate = new Date(2022, 11, 17)

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailableIOS', () => ({
  useIsMailAppAvailableIOS: jest.fn(() => mockIsMailAppAvailable),
}))

describe('<EmailSent/>', () => {
  it('should display the button "Consulter mes e-mails"', () => {
    render(<EmailSent offerDate={offerDate} />)

    expect(screen.queryByTestId('Consulter mes e-mails')).toBeOnTheScreen()
  })

  it('should not show the button to open mail if no mail app is available', async () => {
    mockIsMailAppAvailable = false
    render(<EmailSent offerDate={offerDate} />)

    const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

    expect(checkEmailsButton).toBeNull()
  })
})
