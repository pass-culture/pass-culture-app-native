import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { fireEvent, render, screen } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('LocationWidget', () => {
  it('should show modal when pressing widget', async () => {
    renderLocationWidget()

    const button = screen.getByTestId('Ouvrir la modale de localisation')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})

const renderLocationWidget = () => {
  render(<LocationWidget />)
}
