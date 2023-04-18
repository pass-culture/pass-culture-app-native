import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { offerVenueResponseSnap as venue } from 'features/offer/fixtures/offerVenueReponse'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('react-query')
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const beforeNavigateToItinerary = jest.fn()

describe('<VenueSection />', () => {
  it('should display "Voir l’itinéraire" button when venue address specified', () => {
    render(
      <VenueSection
        venue={venue}
        locationCoordinates={{ latitude: 2, longitude: 4 }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )
    expect(screen.queryByText('Voir l’itinéraire')).toBeTruthy()
  })

  it('should not display "Voir l’itinéraire" button when venue address unspecified', () => {
    render(
      <VenueSection
        venue={{ ...venue, address: '' }}
        locationCoordinates={{ latitude: 2, longitude: 4 }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )
    expect(screen.queryByText('Voir l’itinéraire')).toBeNull()
  })

  it('should log ConsultLocationItinerary analytics when pressing on "Voir l’itinéraire"', () => {
    const { getByText } = render(
      <VenueSection
        venue={venue}
        locationCoordinates={{ latitude: 2, longitude: 4 }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )

    fireEvent.press(getByText('Voir l’itinéraire'))

    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })

  describe('When venue is permanent (showVenueBanner = true)', () => {
    it('should display clickable venue card', () => {
      render(
        <VenueSection
          venue={venue}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-card')).toBeTruthy()
    })

    it('should not display not clickable venue information', () => {
      render(
        <VenueSection
          venue={venue}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-info')).toBeNull()
    })

    it('should log ConsultVenue when pressing venue card', () => {
      render(
        <VenueSection
          venue={venue}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )

      fireEvent.press(screen.getByTestId('venue-card'))

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: venue.id,
        from: 'offer',
      })
    })

    it('should navigate to venue page when pressing venue card', () => {
      render(
        <VenueSection
          venue={venue}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )

      fireEvent.press(screen.getByTestId('venue-card'))

      expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
    })
  })

  describe('When venue is not permanent (showVenueBanner = false)', () => {
    it('should display not clickable venue information', () => {
      render(
        <VenueSection
          venue={{ ...venue, isPermanent: false }}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-info')).toBeTruthy()
    })

    it('should not display clickable venue card', () => {
      render(
        <VenueSection
          venue={{ ...venue, isPermanent: false }}
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-card')).toBeNull()
    })
  })
})
