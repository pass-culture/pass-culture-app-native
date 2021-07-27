import React from 'react'
import { act } from 'react-test-renderer'

import { analytics } from 'libs/analytics'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { fireEvent, render } from 'tests/utils'

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

describe('WhereSection', () => {
  describe('Analytics', () => {
    it('should log ConsultLocationItinerary when clicking on "voir l\'itinéraire"', () => {
      const { getByText } = render(
        <WhereSection
          address="Address"
          offerCoordinates={{ latitude: 2, longitude: 4 }}
          offerId={30}
        />
      )
      act(() => {
        fireEvent.press(getByText("Voir l'itinéraire"))
      })
      expect(analytics.logConsultItinerary).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultItinerary).toHaveBeenCalledWith(30, 'offer')
    })
  })
})
