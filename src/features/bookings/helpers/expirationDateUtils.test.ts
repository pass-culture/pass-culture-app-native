import mockdate from 'mockdate'

import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import {
  daysCountdown,
  displayExpirationMessage,
  getDigitalBookingWithoutExpirationDate,
  isBookingInList,
} from 'features/bookings/helpers/expirationDateUtils'
import { Booking } from 'features/bookings/types'

describe('expirationDateUtils', () => {
  const initialBookings: Booking[] = bookingsSnap.ongoing_bookings
  describe('getDigitalBookingWithoutExpirationDate', () => {
    it('should get an array with a booking if is digital and without expiration date', () => {
      // isDigital === true && !booking.expirationDate
      const validBooking = initialBookings[0]
      const arrayOfBooking = [validBooking]

      expect(getDigitalBookingWithoutExpirationDate(initialBookings)).toStrictEqual(arrayOfBooking)
    })

    it('should return an empty array ', () => {
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

      expect(getDigitalBookingWithoutExpirationDate(arrayOfBooking)).toEqual([])
    })
  })

  describe('isBookingInList', () => {
    it('should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return true if it exist', () => {
      const [firstBooking] = initialBookings
      const getDigitalBookingWithoutExpirationDate = initialBookings

      expect(isBookingInList(firstBooking, getDigitalBookingWithoutExpirationDate)).toBeTruthy()
    })

    it('should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return false if it does not exist ', () => {
      const [firstBooking] = initialBookings
      const newFirstBooking = { ...firstBooking, id: 999 }
      const getDigitalBookingWithoutExpirationDate = initialBookings

      expect(isBookingInList(newFirstBooking, getDigitalBookingWithoutExpirationDate)).toBeFalsy()
    })
  })

  describe('displayExpirationMessage', () => {
    it("should display expiration message : Ta réservation s'archivera dans ${daysLeft} jours  ", () => {
      const daysLeft = 20

      expect(displayExpirationMessage(daysLeft)).toBe("Ta réservation s'archivera dans 20 jours")
    })

    it("should display expiration message : Ta reservation s'archivera demain, when the offer archives the next day", () => {
      const daysLeft = 1

      expect(displayExpirationMessage(daysLeft)).toBe("Ta reservation s'archivera demain")
    })

    it("should display expiration message : Ta réservation s'archive aujourd'hui, when it is the last day when the offer archives today", () => {
      const daysLeft = 0

      expect(displayExpirationMessage(daysLeft)).toBe("Ta réservation s'archive aujourd'hui")
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

    it('should return -1 when the countdown ended  ', () => {
      mockdate.set(new Date('2023-02-10T10:00:00Z'))
      const dateCreated = '2023-01-07T14:38:45.121155Z'
      const endedCountdown = -1

      expect(daysCountdown(dateCreated)).toEqual(endedCountdown)
    })
  })
})
