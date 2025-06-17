import mockdate from 'mockdate'
import React from 'react'

import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { render, screen } from 'tests/utils'

const today = '2025-03-29T09:00:00Z'
mockdate.set(new Date(today))
const oneDayWithdrawalDelay = 86400

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))

describe('<EmailWithdrawal/>', () => {
  describe('EmailWillBeSend', () => {
    it.each`
      withdrawalDelay          | isDuo    | expectedMessage
      ${oneDayWithdrawalDelay} | ${false} | ${`Tu vas recevoir ton billet par e-mail, à l’adresse toto@email.com, 24 heures avant le début de l’évènement.`}
      ${undefined}             | ${false} | ${`Tu vas recevoir ton billet par e-mail, à l’adresse toto@email.com, avant le début de l’évènement.`}
      ${oneDayWithdrawalDelay} | ${true}  | ${`Tu vas recevoir tes billets par e-mail, à l’adresse toto@email.com, 24 heures avant le début de l’évènement.`}
      ${undefined}             | ${true}  | ${`Tu vas recevoir tes billets par e-mail, à l’adresse toto@email.com, avant le début de l’évènement.`}
    `(
      `should return $expectedMessage when withdrawalDelay is $withdrawalDelay and isDuo is $isDuo`,
      async ({ withdrawalDelay, isDuo, expectedMessage }) => {
        renderEmailWithdrawal({
          hasEmailBeenSent: false,
          withdrawalDelay,
          isDuo,
        })

        expect(screen.getByText(expectedMessage)).toBeOnTheScreen()
      }
    )
  })

  describe('<EmailReceived/>', () => {
    beforeEach(() => {
      mockIsMailAppAvailable = true
    })

    it('should display the button "Consulter mes e-mails"', () => {
      renderEmailWithdrawal({
        hasEmailBeenSent: true,
        withdrawalDelay: oneDayWithdrawalDelay,
        isDuo: false,
      })

      expect(screen.getByTestId('Consulter mes e-mails')).toBeOnTheScreen()
    })

    it('should not show the button to open mail when no mail app is available', async () => {
      mockIsMailAppAvailable = false
      renderEmailWithdrawal({
        hasEmailBeenSent: true,
        withdrawalDelay: oneDayWithdrawalDelay,
        isDuo: false,
      })

      const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

      expect(checkEmailsButton).toBeNull()
    })

    it.each`
      hasEmailBeenSent | isDuo    | expectedMessage
      ${true}          | ${true}  | ${'Tes billets t’ont été envoyés par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.'}
      ${true}          | ${false} | ${'Ton billet t’a été envoyé par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.'}
    `(
      `should return $expectedMessage when beginningDatetime is $beginningDatetime and isDuo is $isDuo`,
      async ({ hasEmailBeenSent, isDuo, expectedMessage }) => {
        renderEmailWithdrawal({
          hasEmailBeenSent,
          withdrawalDelay: oneDayWithdrawalDelay,
          isDuo,
        })

        expect(screen.getByText(expectedMessage)).toBeOnTheScreen()
      }
    )
  })
})

const renderEmailWithdrawal = ({
  hasEmailBeenSent,
  withdrawalDelay,
  isDuo,
}: {
  hasEmailBeenSent: boolean
  withdrawalDelay?: number | null
  isDuo: boolean
}) => {
  render(
    <EmailWithdrawal
      hasEmailBeenSent={hasEmailBeenSent}
      withdrawalDelay={withdrawalDelay}
      isDuo={isDuo}
      userEmail="toto@email.com"
    />
  )
}
