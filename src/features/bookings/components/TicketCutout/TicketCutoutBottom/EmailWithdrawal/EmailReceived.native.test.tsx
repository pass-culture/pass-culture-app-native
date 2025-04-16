import React from 'react'

import { EmailReceived } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailReceived'
import { render, screen } from 'tests/utils'

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))

describe('<EmailReceived/>', () => {
  beforeEach(() => {
    mockIsMailAppAvailable = true
  })

  it('should display the button "Consulter mes e-mails"', () => {
    render(<EmailReceived isEventDay />)

    expect(screen.getByTestId('Consulter mes e-mails')).toBeOnTheScreen()
  })

  it('should not show the button to open mail if no mail app is available', async () => {
    mockIsMailAppAvailable = false
    render(<EmailReceived isEventDay />)

    const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

    expect(checkEmailsButton).toBeNull()
  })

  it('should return the correct message if the offer date is today', () => {
    render(<EmailReceived isEventDay />)
    const lineBreak = '\n'
    const expectedMassage = `C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`

    expect(screen.getByText(expectedMassage)).toBeOnTheScreen()
  })

  it('should return the correct message if the offer date is not today', () => {
    render(<EmailReceived isEventDay={false} />)
    const expectedMassage = 'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'

    expect(screen.getByText(expectedMassage)).toBeOnTheScreen()
  })
})
