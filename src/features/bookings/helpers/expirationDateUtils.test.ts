import mockdate from 'mockdate'

import { BookingsResponseV2, SubcategoryIdEnum } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import {
  daysCountdown,
  displayExpirationMessage,
  formattedExpirationDate,
  getDigitalBookingsWithoutExpirationDate,
  getEligibleBookingsForArchive,
  isBookingInList,
  isDigitalBookingWithoutExpirationDate,
  isFreeBookingInSubcategories,
} from 'features/bookings/helpers/expirationDateUtils'

describe('expirationDateUtils', () => {
  const initialBookings = bookingsSnapV2.ongoingBookings

  describe('getEligibleBookingsForArchive', () => {
    it('should return an array with unique bookings when a booking appears in both categories', () => {
      const freeBookingInSubcategory: BookingsResponseV2['endedBookings'][number] = {
        ...bookingsSnapV2.endedBookings[0],
      }
      freeBookingInSubcategory.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      freeBookingInSubcategory.totalAmount = 0
      freeBookingInSubcategory.id = 123
      const digitalBookingsWithoutExpirationDate = initialBookings[0]

      const bookings = [freeBookingInSubcategory, digitalBookingsWithoutExpirationDate]

      expect(getEligibleBookingsForArchive(bookings)).toHaveLength(1)
    })
  })

  describe('getDigitalBookingsWithoutExpirationDate', () => {
    it('should get an array with a booking if is digital and without expiration date', () => {
      // isDigital === true && !booking.expirationDate
      const bookings = [
        {
          ...initialBookings[0],
          stock: {
            ...initialBookings[0].stock,
            offer: { ...initialBookings[0].stock.offer, isDigital: true },
          },
        },
        { ...initialBookings[1] },
      ]
      const validBooking = bookings[0]
      const arrayOfBooking = [validBooking]

      expect(getDigitalBookingsWithoutExpirationDate(bookings)).toStrictEqual(arrayOfBooking)
    })

    it('should return an empty array', () => {
      // isDigital === false && !booking.expirationDate
      const invalidbooking = {
        ...initialBookings[1],
        stock: {
          ...initialBookings[1].stock,
          offer: {
            ...initialBookings[1].stock.offer,
            isDigital: false,
          },
        },
      }
      const arrayOfBooking = [invalidbooking]

      expect(getDigitalBookingsWithoutExpirationDate(arrayOfBooking)).toEqual([])
    })
  })

  describe('isBookingInList', () => {
    it('should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return true if it exist', () => {
      const [firstBooking] = initialBookings
      const getDigitalBookingsWithoutExpirationDate = initialBookings

      expect(isBookingInList(firstBooking, getDigitalBookingsWithoutExpirationDate)).toBeTruthy()
    })

    it('should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return false if it does not exist', () => {
      const [firstBooking] = initialBookings
      const newFirstBooking = { ...firstBooking, id: 999 }
      const getDigitalBookingsWithoutExpirationDate = initialBookings

      expect(isBookingInList(newFirstBooking, getDigitalBookingsWithoutExpirationDate)).toBeFalsy()
    })
  })

  describe('displayExpirationMessage', () => {
    it('should display expiration message : Ta réservation s’archivera dans ${daysLeft} jours', () => {
      const daysLeft = 20

      expect(displayExpirationMessage(daysLeft)).toBe('Ta réservation s’archivera dans 20 jours')
    })

    it('should display expiration message : Ta reservation s’archivera demain, when the offer archives the next day', () => {
      const daysLeft = 1

      expect(displayExpirationMessage(daysLeft)).toBe('Ta reservation s’archivera demain')
    })

    it('should display expiration message : Ta réservation s’archive aujourd’hui, when the offer archives today', () => {
      const daysLeft = 0

      expect(displayExpirationMessage(daysLeft)).toBe('Ta réservation s’archive aujourd’hui')
    })

    it('should display nothing when daysLeft < 0', () => {
      const daysLeft = -1

      expect(displayExpirationMessage(daysLeft)).toBe('')
    })
  })

  describe('daysCountdown', () => {
    it('should return the days countdown between two dates', () => {
      mockdate.set(new Date('2023-01-29T10:00:00Z'))
      const dateCreated = '2023-01-19T14:38:45Z'
      const daysLeftUntilExpiration = 20

      expect(daysCountdown(dateCreated)).toEqual(daysLeftUntilExpiration)
    })

    it('should return -1 when the countdown ended', () => {
      mockdate.set(new Date('2023-02-10T10:00:00Z'))
      const dateCreated = '2023-01-07T14:38:45.121155Z'
      const endedCountdown = -1

      expect(daysCountdown(dateCreated)).toEqual(endedCountdown)
    })
  })

  describe('formattedExpirationDate', () => {
    it('should formatted expiration date from the created date', () => {
      const dateCreated = '2023-01-19T14:38:45Z'
      const expectedformattedExpirationDate = '18/02/2023'

      expect(formattedExpirationDate(dateCreated)).toEqual(expectedformattedExpirationDate)
    })

    it('should return an empty string when dateCreated is an empty string', () => {
      const dateCreated = ''

      expect(formattedExpirationDate(dateCreated)).toEqual('')
    })
  })

  describe('isDigitalBookingWithoutExpirationDate', () => {
    it('should return true when booking is digital without expiration date', () => {
      const value = isDigitalBookingWithoutExpirationDate(bookingsSnapV2.endedBookings[0])

      expect(value).toEqual(true)
    })

    describe('should return false', () => {
      it('when booking is digital with expiration date', () => {
        const value = isDigitalBookingWithoutExpirationDate({
          ...bookingsSnapV2.endedBookings[0],
          expirationDate: '2021-03-15T23:01:37.925926',
        })

        expect(value).toEqual(false)
      })

      it('when booking is not digital without expiration date', () => {
        const value = isDigitalBookingWithoutExpirationDate({
          ...bookingsSnapV2.endedBookings[0],
          stock: {
            ...bookingsSnapV2.endedBookings[0].stock,

            offer: { ...bookingsSnapV2.endedBookings[0].stock.offer, isDigital: false },
          },
        })

        expect(value).toEqual(false)
      })

      it('when booking is not digital with expiration date', () => {
        const value = isDigitalBookingWithoutExpirationDate({
          ...bookingsSnapV2.endedBookings[0],
          expirationDate: '2021-03-15T23:01:37.925926',
          stock: {
            ...bookingsSnapV2.endedBookings[0].stock,

            offer: { ...bookingsSnapV2.endedBookings[0].stock.offer, isDigital: false },
          },
        })

        expect(value).toEqual(false)
      })
    })
  })

  describe('isFreeBookingInSubcategories', () => {
    it('should return true when booking amount is 0 and the offer has a category that can be archived', () => {
      const booking: BookingsResponseV2['ongoingBookings'][number] = {
        ...bookingsSnapV2.ongoingBookings[0],
      }

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      booking.totalAmount = 0

      expect(isFreeBookingInSubcategories(booking)).toBeTruthy()
    })

    it('should return false when booking amount is 0 and the offer has not a category that can be archived', () => {
      const booking: BookingsResponseV2['ongoingBookings'][number] = {
        ...bookingsSnapV2.ongoingBookings[0],
      }

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.ABO_CONCERT
      booking.totalAmount = 0

      expect(isFreeBookingInSubcategories(booking)).toBeFalsy()
    })

    it('should return false when booking amount > 0 and the offer has a category that can be archived', () => {
      const booking: BookingsResponseV2['ongoingBookings'][number] = {
        ...bookingsSnapV2.ongoingBookings[0],
      }

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      booking.totalAmount = 1000

      expect(isFreeBookingInSubcategories(booking)).toBeFalsy()
    })
  })
})
