import mockdate from 'mockdate'
import React from 'react'

import { EmailWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWithdrawal'
import { render, screen } from 'tests/utils'

const today = '2025-03-29T09:00:00Z'
const later = '2025-04-04T09:00:00Z'
mockdate.set(new Date(today))
const oneDayWithdrawalDelay = 86400

describe('<EmailWithdrawal/>', () => {
  describe('EmailWillBeSend', () => {
    it('should return the correct delay when the ticket will be send', () => {
      const delay = '24 heures'
      render(
        <EmailWithdrawal
          beginningDatetime={later}
          withdrawalDelay={oneDayWithdrawalDelay}
          isDuo={false}
        />
      )

      expect(screen.getByText(delay)).toBeOnTheScreen()
    })
  })
})
