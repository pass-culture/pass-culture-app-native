import React from 'react'

import { TicketSwiper } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/TicketSwiper'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/subcategories/useSubcategory')

jest.mock('libs/firebase/analytics/analytics')

describe('<TicketSwiper/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should display ticket without external bookings information if there are no external bookings (externalBookings is null)', () => {
    const data = undefined

    render(<TicketSwiper data={data} />)

    expect(screen.queryByTestId('qr-code')).not.toBeOnTheScreen()
  })

  it('should display one ticket with external bookings information if there are one external booking', () => {
    const data = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]

    render(<TicketSwiper data={data} />)

    expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
  })

  it('should display as many tickets as the number of tickets', () => {
    const data = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:353UW4', seat: 'A13' },
    ]

    render(<TicketSwiper data={data} />)

    expect(screen.queryAllByTestId('qr-code')).toHaveLength(2)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket is equal to one', () => {
      const data = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]

      render(<TicketSwiper data={data} />)

      expect(screen.queryByTestId('swiper-tickets-controls')).not.toBeOnTheScreen()
    })

    it('should show if number of ticket is greater than one', () => {
      const data = [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:353UW4', seat: 'A13' },
      ]

      render(<TicketSwiper data={data} />)

      expect(screen.getByTestId('swiper-tickets-controls')).toBeOnTheScreen()
    })
  })
})
