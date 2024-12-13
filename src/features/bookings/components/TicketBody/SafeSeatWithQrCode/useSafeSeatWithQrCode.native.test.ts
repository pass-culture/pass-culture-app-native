import mockdate from 'mockdate'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { useSafeSeatWithQrCode } from 'features/bookings/components/TicketBody/SafeSeatWithQrCode/useSafeSeatWithQrCode'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { renderHook } from 'tests/utils'

const qrCodeVisibilityHoursBeforeEvent = 2 * 24

const eventDay = dateBuilder().withDay(16).withMonth(0).withHours(1).toString()
const beforeEventIsVisible = dateBuilder().withDay(13).withHours(1).toString()
const whenEventIsVisible = dateBuilder().withDay(15).withHours(1).toString()

const venue = mockBuilder.bookingVenueResponse()

describe('useSafeSeatWithQrCode', () => {
  describe('reservation in a category that should not be hidden', () => {
    const subcategoryId = SubcategoryIdEnum.SEANCE_CINE

    describe('before it should be visible', () => {
      beforeAll(() => {
        mockdate.set(beforeEventIsVisible)
      })

      it('should display Qr Code', () => {
        const { result } = renderUseSafeSeatWithQrCode({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
        })

        expect(result.current.shouldQrCodeBeHidden).toBeFalsy()
      })
    })

    describe('when it should be visible', () => {
      beforeAll(() => {
        mockdate.set(whenEventIsVisible)
      })

      it('should display Qr Code', () => {
        const { result } = renderUseSafeSeatWithQrCode({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
        })

        expect(result.current.shouldQrCodeBeHidden).toBeFalsy()
      })
    })
  })

  describe('reservation in a category that should be hidden', () => {
    const subcategoryId = SubcategoryIdEnum.SEANCE_CINE

    describe('before it should be visible', () => {
      beforeAll(() => {
        mockdate.set(beforeEventIsVisible)
      })

      it('should hide Qr Code', () => {
        const { result } = renderUseSafeSeatWithQrCode({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          categoriesToHide: [subcategoryId],
        })

        expect(result.current.shouldQrCodeBeHidden).toBeTruthy()
      })

      it('should display the right day', () => {
        const { result } = renderUseSafeSeatWithQrCode({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          categoriesToHide: [subcategoryId],
        })

        expect(result.current.day).toEqual('14 janvier 2024 à 02h00')
      })
    })

    describe('when it should be visible', () => {
      beforeAll(() => {
        mockdate.set(whenEventIsVisible)
      })

      it('should display Qr Code', () => {
        const { result } = renderUseSafeSeatWithQrCode({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          subcategoryId,
          categoriesToHide: [subcategoryId],
        })

        expect(result.current.shouldQrCodeBeHidden).toBeFalsy()
      })
    })
  })

  it('should work with default parameters', () => {
    const venue = { timezone: 'Europe/Paris' } as BookingVenueResponse

    const { shouldQrCodeBeHidden, day } = useSafeSeatWithQrCode({
      subcategoryId: SubcategoryIdEnum.CONCERT,
      qrCodeVisibilityHoursBeforeEvent: 48,
      venue,
      beginningDatetime: undefined,
    })

    expect(shouldQrCodeBeHidden).toBe(false)
    expect(day).toBeDefined()
  })
})

const renderUseSafeSeatWithQrCode = (...params: Parameters<typeof useSafeSeatWithQrCode>) =>
  renderHook(() => useSafeSeatWithQrCode(...params))
