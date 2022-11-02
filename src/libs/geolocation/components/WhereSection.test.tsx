import React from 'react'
import { act } from 'react-test-renderer'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
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
const address = mockedFullAddress
const locationCoordinates = { latitude: 2, longitude: 4 }
const beforeNavigateToItinerary = jest.fn()

describe('WhereSection', () => {
  it('should render correctly', () => {
    const whereSection = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={address}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
      />
    )
    expect(whereSection).toMatchSnapshot()

    const whereSectionWithoutVenueBanner = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={address}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
      />
    )
    expect(whereSectionWithoutVenueBanner).toMatchDiffSnapshot(whereSection)
  })

  it('should log ConsultLocationItinerary analytics when clicking on "voir l’itinéraire"', () => {
    const { getByText } = render(
      <WhereSection
        venue={venue}
        locationCoordinates={locationCoordinates}
        address={address}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
      />
    )
    act(() => {
      fireEvent.press(getByText('Voir l’itinéraire'))
    })
    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })
})
