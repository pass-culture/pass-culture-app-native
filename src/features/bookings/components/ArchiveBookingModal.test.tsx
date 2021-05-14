import React from 'react'

import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { fireEvent, render } from 'tests/utils'

describe('<ArchiveBookingModal />', () => {
  it('should call on onDismiss', () => {
    const onDismiss = jest.fn()
    const { getByTestId } = render(<ArchiveBookingModal visible onDismiss={onDismiss} />)
    const button = getByTestId('button-container-back-to-booking')
    fireEvent.press(button)
    expect(onDismiss).toBeCalled()
  })
})
