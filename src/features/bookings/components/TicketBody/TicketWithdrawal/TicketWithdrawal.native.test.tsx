import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { TicketWithdrawal } from 'features/bookings/components/TicketBody/TicketWithdrawal/TicketWithdrawal'
import { render } from 'tests/utils'

describe('<TicketWithdrawal/>', () => {
  it('should display by email withdrawal icon when withdrawal type by email is specified', async () => {
    const { queryByTestId } = render(
      <TicketWithdrawal withdrawalType={WithdrawalTypeEnum.by_email} withdrawalDelay={0} />
    )
    expect(queryByTestId('bicolor-email-sent')).toBeOnTheScreen()
  })

  it('should not display by email withdrawal icon when withdrawal type on site is specified', () => {
    const { queryByTestId } = render(
      <TicketWithdrawal withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={0} />
    )
    expect(queryByTestId('bicolor-email-sent')).not.toBeOnTheScreen()
  })

  it('should display on site withdrawal delay when delay is specified', () => {
    const twoHours = 60 * 60 * 2
    const { queryByTestId } = render(
      <TicketWithdrawal withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={twoHours} />
    )
    expect(queryByTestId('withdrawal-info-delay')).toBeOnTheScreen()
  })

  it('should not display on site withdrawal delay when delay is not specified', () => {
    const { queryByTestId } = render(
      <TicketWithdrawal withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={0} />
    )
    expect(queryByTestId('withdrawal-info-delay')).not.toBeOnTheScreen()
  })
})
