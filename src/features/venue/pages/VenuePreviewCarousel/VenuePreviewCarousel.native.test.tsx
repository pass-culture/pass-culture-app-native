import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueResponse } from 'api/gen'
import { VenuePreviewCarousel } from 'features/venue/pages/VenuePreviewCarousel/VenuePreviewCarousel'
import mockVenueResponse from 'fixtures/venueResponse'
import { render, screen } from 'tests/utils'

const mockUseVenue = jest.fn((): { data: VenueResponse } => ({
  data: mockVenueResponse,
}))

jest.mock('features/venue/queries/useVenueQuery', () => ({
  useVenueQuery: () => mockUseVenue(),
}))

describe('VenuePreviewCarousel', () => {
  it('should render images carousel when bannerUrl defined', () => {
    useRoute.mockReturnValueOnce({
      params: { id: mockVenueResponse.id },
    })

    render(<VenuePreviewCarousel />)

    expect(screen.getByText('1/1')).toBeOnTheScreen()
  })

  it('should render null when bannerUrl not defined', () => {
    useRoute.mockReturnValueOnce({
      params: { id: mockVenueResponse.id },
    })
    mockUseVenue.mockReturnValueOnce({ data: { ...mockVenueResponse, bannerUrl: undefined } })

    render(<VenuePreviewCarousel />)

    expect(screen.queryByText('1/1')).toBeNull()
  })
})
