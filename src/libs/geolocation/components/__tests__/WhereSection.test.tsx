import React from 'react'
import { act } from 'react-test-renderer'

import { offerVenueResponseSnap } from 'features/offer/api/snaps/offerVenueReponseSnap'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const venue = offerVenueResponseSnap
const locationCoordinates = { latitude: 2, longitude: 4 }
const beforeNavigateToItinerary = jest.fn()
const venueAddress = venue.address
  ? `${venue.address}, ${venue.postalCode} ${venue.city}`
  : `${venue.publicName}, ${venue.postalCode} ${venue.city}`

describe('WhereSection', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={venueAddress}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should log ConsultLocationItinerary analytics when clicking on "voir l\'itinéraire"', () => {
    const { getByText } = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={venueAddress}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
      />
    )
    act(() => {
      fireEvent.press(getByText("Voir l'itinéraire"))
    })
    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })
})
