import mockdate from 'mockdate'

import { SubcategoryIdEnum } from 'api/gen'
import { expirationDateUtilsV2 } from 'features/bookings/helpers'
import { mockBuilder } from 'tests/mockBuilder'

describe('expirationDateUtils', () => {
  const ongoingBookings = mockBuilder.ongoingBookingListItemResponse
  const endedBookings = mockBuilder.endedBookingListItemResponse

  describe('getEligibleBookingsForArchive', () => {
    it('should return an array with unique bookings when a booking appears in both categories', () => {
      const freeBooking = ongoingBookings({
        id: 123,
        totalAmount: 0,
        stock: mockBuilder.bookingListItemStockResponse({
          isAutomaticallyUsed: true,
          offer: mockBuilder.bookingListItemOfferResponse({
            subcategoryId: SubcategoryIdEnum.CARTE_MUSEE,
          }),
        }),
      })

      const digitalBookingsWithoutExpirationDate = ongoingBookings({
        id: 123,
        expirationDate: null,
        stock: mockBuilder.bookingListItemStockResponse({
          offer: mockBuilder.bookingListItemOfferResponse({
            isDigital: true,
            subcategoryId: SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE,
          }),
        }),
      })

      const bookings = [freeBooking, digitalBookingsWithoutExpirationDate]

      expect(expirationDateUtilsV2.getEligibleBookingsForArchive(bookings)).toHaveLength(1)
    })
  })

  describe('getDigitalBookingsWithoutExpirationDate', () => {
    it('should return an array of digital booking without expiration date', () => {
      const digitalBookingWithExpirationDate = ongoingBookings({
        id: 123,
        expirationDate: '2021-03-15T23:01:37.925926',
      })

      const digitalBookingWithoutExpirationDate = ongoingBookings({
        id: 456,
      })

      const nonDigitalBooking = ongoingBookings({
        id: 789,
        stock: mockBuilder.bookingListItemStockResponse({
          offer: mockBuilder.bookingListItemOfferResponse({
            isDigital: false,
          }),
        }),
      })

      const bookings = [
        nonDigitalBooking,
        digitalBookingWithExpirationDate,
        digitalBookingWithoutExpirationDate,
      ]

      expect(expirationDateUtilsV2.getDigitalBookingsWithoutExpirationDate(bookings)).toStrictEqual(
        [digitalBookingWithoutExpirationDate]
      )
    })
  })

  describe('isBookingEligibleForArchive', () => {
    const archivableBookingsList = [
      ongoingBookings({
        id: 123,
        stock: mockBuilder.bookingListItemStockResponse({
          offer: mockBuilder.bookingListItemOfferResponse({
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          }),
        }),
      }),
      ongoingBookings({
        id: 456,
        stock: mockBuilder.bookingListItemStockResponse({
          offer: mockBuilder.bookingListItemOfferResponse({
            subcategoryId: SubcategoryIdEnum.ABO_MEDIATHEQUE,
          }),
        }),
      }),
    ]

    it('should be true if booking belongs to the archivable bookings list', () => {
      const booking = ongoingBookings({ id: 123 })

      expect(
        expirationDateUtilsV2.isBookingEligibleForArchive(booking, archivableBookingsList)
      ).toBeTruthy()
    })

    it('should be false if booking does not belong to the archivable bookings list', () => {
      const booking = ongoingBookings({ id: 789 })

      expect(
        expirationDateUtilsV2.isBookingEligibleForArchive(booking, archivableBookingsList)
      ).toBeFalsy()
    })
  })

  describe('displayExpirationMessage', () => {
    it('should display expiration message : Ta réservation s’archivera dans ${daysLeft} jours', () => {
      const daysLeft = 20

      expect(expirationDateUtilsV2.displayExpirationMessage(daysLeft)).toBe(
        'Ta réservation s’archivera dans 20 jours'
      )
    })

    it('should display expiration message : Ta reservation s’archivera demain, when the offer archives the next day', () => {
      const daysLeft = 1

      expect(expirationDateUtilsV2.displayExpirationMessage(daysLeft)).toBe(
        'Ta reservation s’archivera demain'
      )
    })

    it('should display expiration message : Ta réservation s’archive aujourd’hui, when the offer archives today', () => {
      const daysLeft = 0

      expect(expirationDateUtilsV2.displayExpirationMessage(daysLeft)).toBe(
        'Ta réservation s’archive aujourd’hui'
      )
    })

    it('should display nothing when daysLeft < 0', () => {
      const daysLeft = -1

      expect(expirationDateUtilsV2.displayExpirationMessage(daysLeft)).toBe('')
    })
  })

  describe('daysCountdown', () => {
    it('should return the days countdown between two dates', () => {
      mockdate.set(new Date('2023-01-29T10:00:00Z'))
      const dateCreated = '2023-01-19T14:38:45Z'
      const daysLeftUntilExpiration = 20

      expect(expirationDateUtilsV2.daysCountdown(dateCreated)).toEqual(daysLeftUntilExpiration)
    })

    it('should return -1 when the countdown ended', () => {
      mockdate.set(new Date('2023-02-10T10:00:00Z'))
      const dateCreated = '2023-01-07T14:38:45.121155Z'
      const endedCountdown = -1

      expect(expirationDateUtilsV2.daysCountdown(dateCreated)).toEqual(endedCountdown)
    })
  })

  describe('formattedExpirationDate', () => {
    it('should formatted expiration date from the created date', () => {
      const dateCreated = '2023-01-19T14:38:45Z'
      const expectedformattedExpirationDate = '18/02/2023'

      expect(expirationDateUtilsV2.formattedExpirationDate(dateCreated)).toEqual(
        expectedformattedExpirationDate
      )
    })

    it('should return an empty string when dateCreated is an empty string', () => {
      const dateCreated = ''

      expect(expirationDateUtilsV2.formattedExpirationDate(dateCreated)).toEqual('')
    })
  })

  describe('isDigitalBookingWithoutExpirationDate', () => {
    it('should return true when booking is digital without expiration date', () => {
      const booking = endedBookings()
      const result = expirationDateUtilsV2.isDigitalBookingWithoutExpirationDate(booking)

      expect(result).toBe(true)
    })

    describe('should return false', () => {
      it('when booking is digital with expiration date', () => {
        const booking = endedBookings({ expirationDate: '2021-03-15T23:01:37.925926' })

        const result = expirationDateUtilsV2.isDigitalBookingWithoutExpirationDate(booking)

        expect(result).toBe(false)
      })

      it('when booking is not digital without expiration date', () => {
        const booking = endedBookings({
          stock: mockBuilder.bookingListItemStockResponse({
            offer: mockBuilder.bookingListItemOfferResponse({
              isDigital: false,
            }),
          }),
        })
        const result = expirationDateUtilsV2.isDigitalBookingWithoutExpirationDate(booking)

        expect(result).toBe(false)
      })

      it('when booking is not digital with expiration date', () => {
        const booking = endedBookings({
          expirationDate: '2021-03-15T23:01:37.925926',
          stock: mockBuilder.bookingListItemStockResponse({
            offer: mockBuilder.bookingListItemOfferResponse({
              isDigital: false,
            }),
          }),
        })
        const result = expirationDateUtilsV2.isDigitalBookingWithoutExpirationDate(booking)

        expect(result).toBe(false)
      })
    })
  })

  describe('isArchivableBooking', () => {
    it.each`
      bookingDesc                             | isDigital | expirationDate                  | isArchivable | expected
      ${'digital with an expiration date'}    | ${true}   | ${'2021-03-15T23:01:37.925926'} | ${false}     | ${false}
      ${'digital without an expiration date'} | ${true}   | ${null}                         | ${false}     | ${true}
      ${'archivable'}                         | ${false}  | ${null}                         | ${true}      | ${true}
      ${'not archivable'}                     | ${false}  | ${null}                         | ${false}     | ${false}
    `(
      'should return $expected when booking is $bookingDesc',
      ({ expirationDate, isDigital, isArchivable, expected }) => {
        const booking = endedBookings({
          expirationDate,
          isArchivable,
          stock: mockBuilder.bookingListItemStockResponse({
            offer: mockBuilder.bookingListItemOfferResponse({ isDigital }),
          }),
        })
        const result = expirationDateUtilsV2.isArchivableBooking(booking)

        expect(result).toBe(expected)
      }
    )
  })
})
