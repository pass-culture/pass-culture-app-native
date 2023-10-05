import React from 'react'

import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { fireEvent, render, screen, waitForModalToShow } from 'tests/utils'

const dismissModalMock = jest.fn()

describe('VenueModal', () => {
  it('should render correctly', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })
  it('should close when pressing the close button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    const closeButton = screen.getByLabelText('Fermer la modale')
    fireEvent.press(closeButton)

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })
})
