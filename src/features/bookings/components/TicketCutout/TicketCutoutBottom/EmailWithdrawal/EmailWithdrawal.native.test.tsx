import mockdate from 'mockdate'
import React from 'react'

import { EmailWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWithdrawal'
import { render, screen } from 'tests/utils'

const today = '2025-03-29T09:00:00Z'
const yesterday = '2025-03-28T09:00:00Z'
const later = '2025-04-04T09:00:00Z'
mockdate.set(new Date(today))
const oneDayWithdrawalDelay = 86400

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))
const lineBreak = '\n'

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
          beginningDatetime: later,
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
        beginningDatetime: today,
        withdrawalDelay: oneDayWithdrawalDelay,
        isDuo: false,
      })

      expect(screen.getByTestId('Consulter mes e-mails')).toBeOnTheScreen()
    })

    it('should not show the button to open mail when no mail app is available', async () => {
      mockIsMailAppAvailable = false
      renderEmailWithdrawal({
        beginningDatetime: today,
        withdrawalDelay: oneDayWithdrawalDelay,
        isDuo: false,
      })

      const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

      expect(checkEmailsButton).toBeNull()
    })

    it.each`
      beginningDatetime | isDuo    | expectedMessage
      ${today}          | ${true}  | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir tes billets par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.`}
      ${today}          | ${false} | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.`}
      ${yesterday}      | ${true}  | ${'Tes billets t’ont été envoyés par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.'}
      ${yesterday}      | ${false} | ${'Ton billet t’a été envoyé par e-mail à l’adresse toto@email.com. Pense à vérifier tes spams.'}
    `(
      `should return $expectedMessage when beginningDatetime is $beginningDatetime and isDuo is $isDuo`,
      async ({ beginningDatetime, isDuo, expectedMessage }) => {
        renderEmailWithdrawal({
          beginningDatetime,
          withdrawalDelay: oneDayWithdrawalDelay,
          isDuo,
        })

        expect(screen.getByText(expectedMessage)).toBeOnTheScreen()
      }
    )
  })
})

const renderEmailWithdrawal = ({
  beginningDatetime,
  withdrawalDelay,
  isDuo,
}: {
  beginningDatetime?: string | null
  withdrawalDelay?: number | null
  isDuo: boolean
}) => {
  render(
    <EmailWithdrawal
      beginningDatetime={beginningDatetime}
      withdrawalDelay={withdrawalDelay}
      isDuo={isDuo}
      userEmail="toto@email.com"
    />
  )
}
