import mockdate from 'mockdate'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { getHideableQrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/HideableQrCodeWithSeat/getHideableQrCodeWithSeat'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'

const qrCodeVisibilityHoursBeforeEvent = 2 * 24

const eventDay = dateBuilder().withDay(16).withMonth(0).withHours(1).toString()
const beforeEventIsVisible = dateBuilder().withDay(13).withHours(1).toString()
const whenEventIsVisible = dateBuilder().withDay(15).withHours(1).toString()

const venue = mockBuilder.bookingVenueResponse()

describe('getHideableQrCodeWithSeat', () => {
  describe('reservation in a category that should not be hidden', () => {
    const subcategoryId = SubcategoryIdEnum.SEANCE_CINE

    describe('before it should be visible', () => {
      beforeAll(() => {
        mockdate.set(beforeEventIsVisible)
      })

      it('should display Qr Code', () => {
        const result = getHideableQrCodeWithSeat({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          enableHideTicket: false,
        })

        expect(result.shouldQrCodeBeHidden).toBeFalsy()
      })
    })

    describe('when it should be visible', () => {
      beforeAll(() => {
        mockdate.set(whenEventIsVisible)
      })

      it('should display Qr Code', () => {
        const result = getHideableQrCodeWithSeat({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          enableHideTicket: false,
        })

        expect(result.shouldQrCodeBeHidden).toBeFalsy()
      })
    })
  })

  describe('reservation in a category that should be hidden', () => {
    const subcategoryId = SubcategoryIdEnum.SEANCE_CINE

    describe('when FF enableHideTicket is on', () => {
      const enableHideTicket = true

      describe('before it should be visible', () => {
        beforeAll(() => {
          mockdate.set(beforeEventIsVisible)
        })

        it('should hide Qr Code', () => {
          const result = getHideableQrCodeWithSeat({
            beginningDatetime: eventDay,
            qrCodeVisibilityHoursBeforeEvent,
            venue,
            subcategoryId,
            categoriesToHide: [subcategoryId],
            enableHideTicket,
          })

          expect(result.shouldQrCodeBeHidden).toBeTruthy()
        })

        it('should display the right day', () => {
          const result = getHideableQrCodeWithSeat({
            beginningDatetime: eventDay,
            qrCodeVisibilityHoursBeforeEvent,
            venue,
            subcategoryId,
            categoriesToHide: [subcategoryId],
            enableHideTicket,
          })

          expect(result.day).toEqual('14 janvier 2024')
        })

        it('should display the right time', () => {
          const result = getHideableQrCodeWithSeat({
            beginningDatetime: eventDay,
            qrCodeVisibilityHoursBeforeEvent,
            venue,
            subcategoryId,
            categoriesToHide: [subcategoryId],
            enableHideTicket,
          })

          expect(result.time).toEqual('02h00')
        })
      })

      describe('when it should be visible', () => {
        beforeAll(() => {
          mockdate.set(whenEventIsVisible)
        })

        it('should display Qr Code', () => {
          const result = getHideableQrCodeWithSeat({
            beginningDatetime: eventDay,
            qrCodeVisibilityHoursBeforeEvent,
            venue,
            subcategoryId,
            categoriesToHide: [subcategoryId],
            enableHideTicket,
          })

          expect(result.shouldQrCodeBeHidden).toBeFalsy()
        })
      })
    })

    describe('when FF enableHideTicket is off', () => {
      mockdate.set(beforeEventIsVisible)

      it('should not hide Qr Code', () => {
        const result = getHideableQrCodeWithSeat({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          categoriesToHide: [subcategoryId],
          enableHideTicket: false,
        })

        expect(result.shouldQrCodeBeHidden).toBeFalsy()
      })
    })
  })

  it('should work with default parameters', () => {
    const venue = { timezone: 'Europe/Paris' } as BookingVenueResponse

    const { shouldQrCodeBeHidden, day } = getHideableQrCodeWithSeat({
      subcategoryId: SubcategoryIdEnum.CONCERT,
      qrCodeVisibilityHoursBeforeEvent: 48,
      venue,
      beginningDatetime: undefined,
      enableHideTicket: false,
    })

    expect(shouldQrCodeBeHidden).toBe(false)
    expect(day).toBeDefined()
  })
})
