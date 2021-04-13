import React from 'react'
import { act } from 'react-test-renderer'

import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { OfferWhereSection } from '../OfferWhereSection'

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

describe('OfferWhereSection', () => {
  describe('Analytics', () => {
    it('should log ConsultLocationItinerary when clicking on "voir l\'itinéraire"', () => {
      const { getByText } = render(
        <OfferWhereSection
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
