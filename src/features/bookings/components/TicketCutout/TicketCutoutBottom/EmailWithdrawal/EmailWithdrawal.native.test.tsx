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
    it('should return future message without delay when no withdrawaldelay', () => {
      renderEmailWithdrawal({
        beginningDatetime: later,
        withdrawalDelay: undefined,
        isDuo: false,
      })

      expect(
        screen.getByText('Tu vas recevoir ton billet par e-mail avant le début de l’évènement.')
      ).toBeOnTheScreen()
    })
  })

  it('should return future message with delay when a withdrawal delay was given', () => {
    const delay = '24 heures'

    renderEmailWithdrawal({
      beginningDatetime: later,
      withdrawalDelay: oneDayWithdrawalDelay,
      isDuo: false,
    })

    expect(
      screen.getByText(
        `Tu vas recevoir ton billet par e-mail ${delay} avant le début de l’évènement.`
      )
    ).toBeOnTheScreen()
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
      `should return $expected when isEventDay is $isEventDay and isDuo is $isDuo`,
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
