import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { VenueBody } from 'features/venue/pages/VenueBody'
import { analytics } from 'libs/analytics'
import { act, fireEvent } from 'tests/utils'
import { render } from 'tests/utils'

const venueId = venueResponseSnap.id

jest.mock('react-query')
jest.mock('features/auth/settings')
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
  beforeEach(() => {
    jest.clearAllMocks()
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
})

function renderVenueBody() {
  return render(<VenueBody venueId={venueId} onScroll={jest.fn()} />)
}
