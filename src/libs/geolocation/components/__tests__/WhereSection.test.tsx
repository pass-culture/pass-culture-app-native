import React from 'react'
import { act } from 'react-test-renderer'

import { offerAdaptedResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
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
const offer = offerAdaptedResponseSnap

const locationCoordinates = { latitude: 2, longitude: 4 }
const beforeNavigateToItinerary = jest.fn()

describe('WhereSection', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={offer.fullAddress}
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
        address={offer.fullAddress}
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
