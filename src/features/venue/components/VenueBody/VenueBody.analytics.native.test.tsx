import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { act, fireEvent, render, screen } from 'tests/utils'

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
    jest.useFakeTimers('legacy')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const trigger = async (component: ReactTestInstance) => {
    await act(async () => {
      fireEvent.press(component)
      jest.runAllTimers()
    })
  }

  it('should log ConsultWithdrawalModalities once when opening accessibility modalities', async () => {
    renderVenueBody()

    await trigger(screen.getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ venueId })

    await trigger(screen.getByText('Accessibilité'))
    await trigger(screen.getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    renderVenueBody()

    await trigger(screen.getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ venueId })

    await trigger(screen.getByText('Modalités de retrait'))
    await trigger(screen.getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultLocationItinerary when opening itinerary', async () => {
    renderVenueBody()
    await act(async () => {
      fireEvent.press(screen.getByText('Voir l’itinéraire'))
    })
    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({ venueId, from: 'venue' })
  })
})

function renderVenueBody() {
  return render(<VenueBody venueId={venueId} onScroll={jest.fn()} />)
}
