import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { logConsultItinerary } from 'libs/analytics'

import { OfferWhereSection } from '../OfferWhereSection'

jest.mock('features/offer/services/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

describe('OfferWhereSection', () => {
  describe('Analytics', () => {
    it('should log ConsultLocationItinerary when clicking on "voir l\'itinéraire"', () => {
      const { getByText } = render(
        <OfferWhereSection address="Address" offerPosition={{ lat: 2, lng: 4 }} offerId={30} />
      )
      act(() => {
        fireEvent.press(getByText("Voir l'itinéraire"))
      })
      expect(logConsultItinerary).toHaveBeenCalledTimes(1)
      expect(logConsultItinerary).toHaveBeenCalledWith(30)
    })
  })
})
