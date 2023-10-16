import React from 'react'

import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitForModalToShow, waitFor } from 'tests/utils'

const dismissModalMock = jest.fn()
const mockVenues: Venue[] = [{ label: 'venueLabel', info: 'info', venueId: 1234 }]

jest.mock('libs/place', () => ({
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

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

  it('should trigger logEvent "logUserSetVenue" when pressing "Valider le point de vente" button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockVenues[0].label)

    const suggestedVenue = await screen.findByText(mockVenues[0].label)
    fireEvent.press(suggestedVenue)

    const validateButon = screen.getByText('Valider le point de vente')
    await waitFor(() => {
      expect(validateButon).toBeEnabled()
    })
    fireEvent.press(validateButon)

    expect(analytics.logUserSetVenue).toHaveBeenCalledWith({ venueLabel: mockVenues[0].label })
  })
})
