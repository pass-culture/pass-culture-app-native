import React from 'react'

import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { render, screen } from 'tests/utils'

describe('<OnSiteWithdrawal>', () => {
  it('should display token', () => {
    render(<OnSiteWithdrawal token="NBFJ55K8" />)

    expect(screen.getByText('NBFJ55K8')).toBeOnTheScreen()
  })
})
