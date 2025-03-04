import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { BookingCloseInformation } from './BookingCloseInformation'

const mockHideModal = jest.fn()

jest.useFakeTimers()

describe('BookingCloseInformation', () => {
  it('calls hideModal when the "J’ai compris" button is press', async () => {
    render(<BookingCloseInformation visible hideModal={mockHideModal} />)
    const button = screen.getByText('J’ai compris')
    await userEvent.setup().press(button)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })
})
