import React from 'react'
import { act } from 'react-test-renderer'

import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { fireEvent, render } from 'tests/utils'

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

describe('WhereSection', () => {
  const beforeNavigateToItinerary = jest.fn()
  describe('Analytics', () => {
    it('should log ConsultLocationItinerary when clicking on "voir l\'itinéraire"', () => {
      const { getByText } = render(
        <WhereSection
          address="Address"
          locationCoordinates={{ latitude: 2, longitude: 4 }}
          beforeNavigateToItinerary={beforeNavigateToItinerary}
        />
      )
      act(() => {
        fireEvent.press(getByText("Voir l'itinéraire"))
      })
      expect(beforeNavigateToItinerary).toHaveBeenCalledTimes(1)
      expect(beforeNavigateToItinerary).toHaveBeenCalledWith()
    })
  })
})
