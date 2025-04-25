import mockdate from 'mockdate'
import React from 'react'

import { BookingReponse, BookingsResponse, CategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import {
  TicketCutoutBottom,
  TicketCutoutBottomProps,
} from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCutoutBottom'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const ongoingBookings: BookingReponse = bookingsSnap.ongoing_bookings[0]

describe('<TicketCutout/>', () => {
  describe('offer is digital', () => {
    it('should display token when booking has one', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)

      booking.stock.offer.isDigital = true
      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByText('352UW4')).toBeOnTheScreen()
    })

    it('should display activationCode when booking has one', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)

      booking.activationCode = {
        code: 'someCode',
      }
      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByText('someCode')).toBeOnTheScreen()
    })
  })

  describe('offer is not  digital', () => {
    it('should render NoTicket component when withdrawalType is noTicket', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false
      booking.stock.offer.withdrawalType = WithdrawalTypeEnum.no_ticket

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('withdrawal-info-no-ticket')).toBeOnTheScreen()
    })

    it('should render EmailWithdrawal component when withdrawalType is email and userEmail is defined', () => {
      mockdate.set(new Date('2020-12-01T00:00:00Z'))
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = WithdrawalTypeEnum.by_email

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('withdrawal-email-will-be-send')).toBeOnTheScreen()
    })

    it('should render OnSiteWithdrawal component when withdrawalType is on site', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = WithdrawalTypeEnum.on_site

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('withdrawal-on-site')).toBeOnTheScreen()
    })

    it('should render InAppWithdrawal component when withdrawalType is in app', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = WithdrawalTypeEnum.in_app

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('solo-ticket')).toBeOnTheScreen()
    })

    it('should render SoloTicket component when booking has no withdrawalType, has a QR code and is a subcategory that should have QR code', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false
      booking.stock.offer.withdrawalType = null

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('solo-ticket')).toBeOnTheScreen()
    })

    it('should render OnSiteWithdrawal component when booking has no withdrawalType, has no QR code, is a subcategory that should have QR code and has a token', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = null
      booking.qrCodeData = undefined

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('withdrawal-on-site')).toBeOnTheScreen()
    })

    it('should render OnSiteWithdrawal component when booking has no withdrawalType, has a QR code, is not a subcategory that should have QR code and has a token', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = null
      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        subcategoryShouldHaveQrCode: false,
      })

      expect(screen.getByTestId('withdrawal-on-site')).toBeOnTheScreen()
    })

    it('should render activationCode when booking has no withdrawalType, has neither QR code nor token', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = null
      booking.token = undefined
      booking.qrCodeData = undefined
      booking.activationCode = {
        code: 'someCode',
      }

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByText('someCode')).toBeOnTheScreen()
    })

    it('should render no ticket component when booking has no withdrawalType, has neither QR code nor token nor activationCode', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.stock.offer.isDigital = false

      booking.stock.offer.withdrawalType = null
      booking.token = undefined
      booking.qrCodeData = undefined
      booking.activationCode = undefined

      renderTicketCutout({
        booking,
        enableHideTicket: true,
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        subcategoryShouldHaveQrCode: true,
      })

      expect(screen.getByTestId('withdrawal-info-no-ticket')).toBeOnTheScreen()
    })
  })
})

const renderTicketCutout = ({
  booking,
  enableHideTicket,
  isEvent,
  categoryId,
  subcategoryShouldHaveQrCode,
  userEmail = 'toto@email.com',
}: TicketCutoutBottomProps) => {
  render(
    <TicketCutoutBottom
      booking={booking}
      enableHideTicket={enableHideTicket}
      isEvent={isEvent}
      categoryId={categoryId}
      subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
      userEmail={userEmail}
    />
  )
}
