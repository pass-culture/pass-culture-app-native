import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { DefaultBody } from 'features/bookings/components/TicketBody/DefaultBody/DefaultBody'
import { render } from 'tests/utils'

describe('<DefaultBody/>', () => {
  it('should display by email withdrawal icon when withdrawal type by email is specified', () => {
    const { queryByTestId } = render(
      <DefaultBody withdrawalType={WithdrawalTypeEnum.by_email} withdrawalDelay={0} />
    )
    expect(queryByTestId('bicolor-email-sent')).toBeTruthy()
  })

  it('should not display by email withdrawal icon when withdrawal type on site is specified', () => {
    const { queryByTestId } = render(
      <DefaultBody withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={0} />
    )
    expect(queryByTestId('bicolor-email-sent')).toBeFalsy()
  })

  it('should display on site withdrawal delay when delay is specified', () => {
    const twoHours = 60 * 60 * 2
    const { queryByTestId } = render(
      <DefaultBody withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={twoHours} />
    )
    expect(queryByTestId('withdrawal-info-delay')).toBeTruthy()
  })

  it('should not display on site withdrawal delay when delay is not specified', () => {
    const { queryByTestId } = render(
      <DefaultBody withdrawalType={WithdrawalTypeEnum.on_site} withdrawalDelay={0} />
    )
    expect(queryByTestId('withdrawal-info-delay')).toBeFalsy()
  })
})
