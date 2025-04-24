import { getEmailReceivedWithdrawalMessage } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/getEmailReceivedWithdrawalMessage'

const lineBreak = '\n'

describe('getEmailReceivedWithdrawalMessage', () => {
  it.each`
    isEventDay | isDuo    | userEmail          | expected
    ${true}    | ${true}  | ${'toto@Email.fr'} | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir tes billets par e-mail à l’adresse toto@Email.fr. Pense à vérifier tes spams.`}
    ${true}    | ${false} | ${'toto@Email.fr'} | ${`C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail à l’adresse toto@Email.fr. Pense à vérifier tes spams.`}
    ${false}   | ${true}  | ${'toto@Email.fr'} | ${'Tes billets t’ont été envoyés par e-mail à l’adresse toto@Email.fr. Pense à vérifier tes spams.'}
    ${false}   | ${false} | ${'toto@Email.fr'} | ${'Ton billet t’a été envoyé par e-mail à l’adresse toto@Email.fr. Pense à vérifier tes spams.'}
  `(
    `should return $expected when isEventDay is $isEventDay and isDuo is $isDuo`,
    async ({ isEventDay, isDuo, expected, userEmail }) => {
      expect(getEmailReceivedWithdrawalMessage({ isEventDay, isDuo, userEmail })).toBe(expected)
    }
  )
})
