import mockdate from 'mockdate'

import { WithdrawalTypeEnum } from 'api/gen'
import {
  getDelayMessage,
  getEmailMessage,
  getStartMessage,
} from 'features/bookings/components/TicketBody/ticketBodyMessages'
import { formatSecondsToString } from 'features/bookings/helpers'

const whiteSpace = ' '
const lineBreak = '\n'
const today = new Date(2020, 11, 17)
const tomorrow = new Date(2020, 11, 18)
mockdate.set(today)

describe('<ticketBodyMessages/>', () => {
  describe('getStartMessage', () => {
    it('should return the correct message if withdrawal type is on site', () => {
      const startMessage = getStartMessage(WithdrawalTypeEnum.on_site)
      expect(startMessage).toEqual(`Présente le code ci-dessus sur place${whiteSpace}`)
    })

    it('should return the correct message if withdrawal type is by email', () => {
      const startMessage = getStartMessage(WithdrawalTypeEnum.by_email)
      expect(startMessage).toEqual(`Tu vas recevoir ton billet par e-mail${whiteSpace}`)
    })

    it('should not return message if if there is no withdrawal type', () => {
      const startMessage = getStartMessage(WithdrawalTypeEnum.no_ticket)
      expect(startMessage).toBeNull()
    })
  })

  describe('getDelayMessage', () => {
    it('should return the correct message if there is withdrawal delay', () => {
      const oneDay = 60 * 60 * 24
      const delayMessage = getDelayMessage(oneDay)
      expect(delayMessage).toEqual(`${formatSecondsToString(oneDay)}${whiteSpace}`)
    })

    it('should not return message if there is no withdrawal delay', () => {
      const withdrawalDelay = 0
      const delayMessage = getDelayMessage(withdrawalDelay)
      expect(delayMessage).toBeNull()
    })
  })

  describe('getEmailMessage', () => {
    it('should return the correct message if the offer date is today', () => {
      const emailMessage = getEmailMessage(today)
      expect(emailMessage).toEqual(
        `C’est aujourd’hui\u00a0!${lineBreak}Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`
      )
    })

    it('should return the correct message if the offer date is not today', () => {
      const emailMessage = getEmailMessage(tomorrow)
      expect(emailMessage).toEqual(
        'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'
      )
    })
  })
})
