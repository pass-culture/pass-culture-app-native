import React from 'react'

import { offerVenueResponseSnap as venue } from 'features/offer/fixtures/offerVenueReponse'
import { mockedFullAddress as address } from 'libs/address/fixtures/mockedFormatFullAddress'
import { WhereSection } from 'libs/location/components/WhereSection'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const beforeNavigateToItinerary = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('WhereSection', () => {
  it('should log ConsultLocationItinerary analytics when clicking on "voir l’itinéraire"', async () => {
    render(
      reactQueryProviderHOC(
        <WhereSection
          venue={venue}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          address={address}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
        />
      )
    )

    await user.press(screen.getByText('Voir l’itinéraire'))

    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })
})
