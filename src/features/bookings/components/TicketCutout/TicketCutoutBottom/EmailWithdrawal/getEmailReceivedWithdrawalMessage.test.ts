import { getEmailReceivedWithdrawalMessage } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/getEmailReceivedWithdrawalMessage'

const lineBreak = '\n'

describe('getEmailReceivedWithdrawalMessage', () => {
  it.each`
    isEventDay | isDuo    | expected
    ${true}    | ${true}  | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir tes billets par e-mail. Pense à vérifier tes spams.`}
    ${true}    | ${false} | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`}
    ${false}   | ${true}  | ${'Tes billets t’ont été envoyés par e-mail. Pense à vérifier tes spams.'}
    ${false}   | ${false} | ${'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'}
  `(
    `should return $expected when isEventDay is $isEventDay and isDuo is $isDuo`,
    async ({ isEventDay, isDuo, expected }) => {
      expect(getEmailReceivedWithdrawalMessage({ isEventDay, isDuo })).toBe(expected)
    }
  )
})
