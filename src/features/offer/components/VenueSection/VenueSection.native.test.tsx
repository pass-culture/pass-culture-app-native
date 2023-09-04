import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { offerVenueResponseSnap as venue } from 'features/offer/fixtures/offerVenueReponse'
import { analytics } from 'libs/analytics'
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
  it('should display "Voir l’itinéraire" button when complete venue address specified', () => {
    render(
      <VenueSection
        venue={venue}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )
    expect(screen.queryByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should display public venue name when specified', () => {
    render(
      <VenueSection
        venue={{ ...venue, publicName: 'Le Petit Rintintin' }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )

    expect(screen.queryByText('Le Petit Rintintin')).toBeOnTheScreen()
  })

  it('should not display venue name when public venue name specified', () => {
    render(
      <VenueSection
        venue={{ ...venue, publicName: 'Le Petit Rintintin' }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )

    expect(screen.queryByText('Le Petit Rintintin 1')).not.toBeOnTheScreen()
  })

  it('should display venue name when public venue name unspecified', () => {
    render(
      <VenueSection
        venue={{ ...venue, publicName: undefined }}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )

    expect(screen.queryByText('Le Petit Rintintin 1')).toBeOnTheScreen()
  })

  describe('should not display "Voir l’itinéraire" button', () => {
    it('when complete venue address unspecified', () => {
      render(
        <VenueSection
          venue={{ ...venue, address: '', city: '', postalCode: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue address specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, city: '', postalCode: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue postal code specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, address: '', city: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue city specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, address: '', postalCode: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue city and postal code specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, address: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue city and address specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, postalCode: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('when only venue postal code and address specified', () => {
      render(
        <VenueSection
          venue={{ ...venue, city: '' }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })
  })

  it('should call `beforeNavigateToItinerary` function when pressing on "Voir l’itinéraire"', () => {
    render(
      <VenueSection
        venue={venue}
        beforeNavigateToItinerary={beforeNavigateToItinerary}
        showVenueBanner
        title="Lieu de retrait"
      />
    )

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
  })

  describe('When venue is permanent (showVenueBanner = true)', () => {
    it('should display clickable venue card', () => {
      render(
        <VenueSection
          venue={venue}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-card')).toBeOnTheScreen()
    })

    it('should not display not clickable venue information', () => {
      render(
        <VenueSection
          venue={venue}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          showVenueBanner
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-info')).not.toBeOnTheScreen()
    })

    it('should log ConsultVenue when pressing venue card', () => {
      render(
        <VenueSection
          venue={venue}
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
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-info')).toBeOnTheScreen()
    })

    it('should not display clickable venue card', () => {
      render(
        <VenueSection
          venue={{ ...venue, isPermanent: false }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
          title="Lieu de retrait"
        />
      )
      expect(screen.queryByTestId('venue-card')).not.toBeOnTheScreen()
    })
  })
})
