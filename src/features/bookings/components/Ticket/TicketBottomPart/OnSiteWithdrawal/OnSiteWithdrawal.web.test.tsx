import React from 'react'

import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import * as copyToClipboardModule from 'libs/copyToClipboard/copyToClipboard'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockCopyToClipboard = jest.spyOn(copyToClipboardModule, 'copyToClipboard')

describe('<OnSiteWithdrawal>', () => {
  it('should copy to clickboard on press', () => {
    render(<OnSiteWithdrawal token="NBFJ55K8" isDuo={false} />)
    fireEvent.click(screen.getByText('NBFJ55K8'))

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1)
  })
})
