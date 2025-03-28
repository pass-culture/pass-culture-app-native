import mockdate from 'mockdate'

import { getDelayMessage } from 'features/bookings/components/TicketBody/ticketBodyMessages'
import { formatSecondsToString } from 'features/bookings/helpers'

const whiteSpace = ' '
const today = new Date(2020, 11, 17)
mockdate.set(today)

describe('<ticketBodyMessages/>', () => {
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
})
