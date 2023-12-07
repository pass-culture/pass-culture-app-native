import React from 'react'

import { Venue } from 'features/search/components/sections/Venue/Venue'
import { initialSearchState } from 'features/search/context/reducer'
import { act, fireEvent, render, screen } from 'tests/utils'

let mockSearchState = initialSearchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('Venue component', () => {
  it('should display the venue label when a venue is selected', async () => {
    mockSearchState = {
      ...initialSearchState,
      venue: { label: 'Venue label', info: 'info', venueId: 123 },
    }
    render(<Venue />)

    await act(async () => {})

    expect(await screen.findByText('Venue label')).toBeOnTheScreen()
  })

  it('should open venue modal when clicking on the venue category button', async () => {
    render(<Venue />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const searchVenueButton = screen.getByTestId('FilterRow')

    await act(async () => {
      fireEvent.press(searchVenueButton)
    })

    const modalButton = screen.getByText('Rechercher')

    expect(modalButton).toBeOnTheScreen()
  })
})
