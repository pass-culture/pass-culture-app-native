import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { fireEvent, render, screen } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('LocationSearchWidget', () => {
  it('should show modal when pressing widget', async () => {
    render(<LocationSearchWidget />)

    const button = screen.getByTestId('Ouvrir la modale de localisation')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})
