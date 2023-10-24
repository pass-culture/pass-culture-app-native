import React from 'react'

import { offerVenueResponseSnap as venue } from 'features/offer/fixtures/offerVenueReponse'
import { mockedFullAddress as address } from 'libs/address/fixtures/mockedFormatFullAddress'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { fireEvent, render, act, screen } from 'tests/utils'

jest.mock('react-query')
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const beforeNavigateToItinerary = jest.fn()

describe('WhereSection', () => {
  it('should log ConsultLocationItinerary analytics when clicking on "voir l’itinéraire"', () => {
    render(
      <WhereSection
        venue={venue}
        locationCoordinates={{ latitude: 2, longitude: 4 }}
        address={address}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
      />
    )

    act(() => {
      fireEvent.press(screen.getByText('Voir l’itinéraire'))
    })

    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })
})
