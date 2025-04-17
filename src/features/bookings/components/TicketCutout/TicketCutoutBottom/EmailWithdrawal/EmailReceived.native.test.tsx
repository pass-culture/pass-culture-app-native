import React from 'react'

import { EmailReceived } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailReceived'
import { render, screen } from 'tests/utils'

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))
const lineBreak = '\n'

describe('<EmailReceived/>', () => {
  beforeEach(() => {
    mockIsMailAppAvailable = true
  })

  it('should display the button "Consulter mes e-mails"', () => {
    render(<EmailReceived isEventDay isDuo={false} />)

    expect(screen.getByTestId('Consulter mes e-mails')).toBeOnTheScreen()
  })

  it('should not show the button to open mail if no mail app is available', async () => {
    mockIsMailAppAvailable = false
    render(<EmailReceived isEventDay isDuo={false} />)

    const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

    expect(checkEmailsButton).toBeNull()
  })

  it.each`
    isEventDay | isDuo    | expectedMassage
    ${true}    | ${true}  | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir tes billets par e-mail. Pense à vérifier tes spams.`}
    ${true}    | ${false} | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`}
    ${false}   | ${true}  | ${'Tes billets t’ont été envoyés par e-mail. Pense à vérifier tes spams.'}
    ${false}   | ${false} | ${'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'}
  `(
    `should return $expected when isEventDay is $isEventDay and isDuo is $isDuo`,
    async ({ isEventDay, isDuo, expectedMassage }) => {
      render(<EmailReceived isEventDay={isEventDay} isDuo={isDuo} />)

      expect(screen.getByText(expectedMassage)).toBeOnTheScreen()
    }
  )
})
