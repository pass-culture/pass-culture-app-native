import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { act, fireEvent, render, screen } from 'tests/utils'

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

  it('should show tooltip after 1 second and hide 8 seconds after it appeared', async () => {
    jest.useFakeTimers({ legacyFakeTimers: true })
    renderLocationWidget()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(
      screen.getByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).toBeTruthy()

    await act(async () => {
      jest.advanceTimersByTime(8000)
    })

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).toBeFalsy()
  })

  it('should hide tooltip when pressing close button', async () => {
    jest.useFakeTimers({ legacyFakeTimers: true })
    renderLocationWidget()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    const button = screen.getByLabelText('Fermer le tooltip')

    fireEvent.press(button)

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).toBeFalsy()
  })
})

const renderLocationWidget = () => {
  render(<LocationWidget />)
}
