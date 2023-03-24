import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { BookingCloseInformation } from './BookingCloseInformation'

const mockHideModal = jest.fn()

describe('BookingCloseInformation', () => {
  it('calls hideModal when the "J’ai compris" button is press', () => {
    render(<BookingCloseInformation visible hideModal={mockHideModal} />)
    const button = screen.getByText('J’ai compris')
    fireEvent.press(button)
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })
})
