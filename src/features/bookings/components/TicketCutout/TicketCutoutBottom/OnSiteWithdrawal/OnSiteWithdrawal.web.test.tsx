import React from 'react'

import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockCopyToClipboard = jest.fn()
jest.mock('libs/useCopyToClipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: () => mockCopyToClipboard,
}))

describe('<OnSiteWithdrawal>', () => {
  it('should copy to clickboard on press', () => {
    render(<OnSiteWithdrawal token="NBFJ55K8" />)
    fireEvent.click(screen.getByText('NBFJ55K8'))

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1)
  })
})
