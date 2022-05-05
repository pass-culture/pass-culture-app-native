import React from 'react'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { render } from 'tests/utils/web'

const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

describe('<SwiperTickets/>', () => {
  it('should render properly', () => {
    const renderAPI = render(<SwiperTickets booking={booking} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display as many tickets as the number of tickets', () => {
    booking.externalBookingsInfos = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
    ]
    const { queryAllByTestId } = render(<SwiperTickets booking={booking} />)
    expect(queryAllByTestId('three-shapes-ticket').length).toEqual(3)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket === 0', () => {
      booking.externalBookingsInfos = undefined
      const { queryByTestId } = render(<SwiperTickets booking={booking} />)
      expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
    })

    it('should not show if number of ticket === 1', () => {
      booking.externalBookingsInfos = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
      const { queryByTestId } = render(<SwiperTickets booking={booking} />)
      expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
    })

    describe('with >= 2 tickets', () => {
      beforeEach(() => {
        booking.externalBookingsInfos = [
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
        ]
      })

      it('should show if isMobileViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: false, isTabletViewport: false, isMobileViewport: true },
        })
        queryByTestId('swiper-tickets-controls')
      })

      it('should show if isTabletViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: false, isTabletViewport: true, isMobileViewport: false },
        })
        expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
      })

      it('should not show if isDesktopViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: true, isTabletViewport: false, isMobileViewport: false },
        })
        expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
      })
    })

    describe('with >= 3 tickets', () => {
      beforeEach(() => {
        booking.externalBookingsInfos = [
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
        ]
      })

      it('should show if and isMobileViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: false, isTabletViewport: false, isMobileViewport: true },
        })
        queryByTestId('swiper-tickets-controls')
      })

      it('should show if isTabletViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: false, isTabletViewport: true, isMobileViewport: false },
        })
        queryByTestId('swiper-tickets-controls')
      })

      it('should show if isDesktopViewport', () => {
        const { queryByTestId } = render(<SwiperTickets booking={booking} />, {
          theme: { isDesktopViewport: true, isTabletViewport: false, isMobileViewport: false },
        })
        queryByTestId('swiper-tickets-controls')
      })
    })
  })
})
