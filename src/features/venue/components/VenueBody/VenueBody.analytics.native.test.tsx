import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, render } from 'tests/utils'

const venueId = venueResponseSnap.id

jest.mock('react-query')

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({
    availableApps: [],
    navigateTo: jest.fn(),
  })),
}))

describe('<VenueBody /> - Analytics', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const trigger = (component: ReactTestInstance) => {
    act(() => {
      fireEvent.press(component)
      jest.advanceTimersByTime(300)
    })
  }

  it('should log ConsultWithdrawalModalities once when opening accessibility modalities', () => {
    const { getByText } = renderVenueBody()

    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ venueId })

    trigger(getByText('Accessibilité'))
    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', () => {
    const { getByText } = renderVenueBody()

    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ venueId })

    trigger(getByText('Modalités de retrait'))
    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultLocationItinerary when opening itinerary', () => {
    const wrapper = renderVenueBody()
    act(() => {
      fireEvent.press(wrapper.getByText('Voir l’itinéraire'))
    })
    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({ venueId, from: 'venue' })
  })
})

function renderVenueBody() {
  return render(<VenueBody venueId={venueId} onScroll={jest.fn()} />)
}
