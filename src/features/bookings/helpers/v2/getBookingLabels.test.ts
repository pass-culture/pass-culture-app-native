import mockdate from 'mockdate'

import { BookingResponse } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getBookingLabelsV2 } from 'features/bookings/helpers'

describe('getBookingLabels', () => {
  it('should return the correct dateLabel for permanent bookings', () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isPermanent: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Permanent',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })

  it('should not return the location for digital bookings', () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isDigital: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels.locationLabel).toEqual('')
  })

  it('should return the correct date and location for events', () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      dayLabel: '15 mars 2021',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: '',
    })
  })

  it('should return the correct withdrawal date and location for events if starting today', () => {
    mockdate.set(new Date('2021-03-15T18:00:00')) // 2 hours before
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      dayLabel: '15 mars 2021',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Aujourd’hui',
    })
  })

  it('should return the correct withdrawal date and location for events if starting tomorrow', () => {
    mockdate.set(new Date('2021-03-14T19:00:00')) // 25 hours before
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      dayLabel: '15 mars 2021',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Demain',
    })
  })

  it('should return the correct withdrawal date if expires today for physical bookings', () => {
    mockdate.set(new Date('2021-03-15T21:00:00'))
    const booking = {
      ...bookingsSnapV2.ongoingBookings[0],
      expirationDate: '2021-03-15T23:00:00', // expires in 2 hours
    } as unknown as BookingResponse
    const properties = { isPhysical: true }
    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À retirer avant le 15 mars 2021',
      dayLabel: '',
      hourLabel: '',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Dernier jour pour retirer',
    })
  })

  it('should return the correct withdrawal date if expires tomorrow for physical bookings', () => {
    mockdate.set(new Date('2021-03-15T21:00:00'))
    const booking = {
      ...bookingsSnapV2.ongoingBookings[0],
      expirationDate: '2021-03-16T22:00:00', // expires in 25 hours
    } as unknown as BookingResponse
    const properties = { isPhysical: true }
    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À retirer avant le 16 mars 2021',
      dayLabel: '',
      hourLabel: '',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Avant dernier jour pour retirer',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes but no expiration date', () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const properties = { isDigital: true, hasActivationCode: true }

    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À activer',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes with expiration date', () => {
    const booking: BookingResponse = {
      ...bookingsSnapV2.ongoingBookings[0],
      ticket: {
        ...bookingsSnapV2.ongoingBookings[0].ticket,
        activationCode: { code: 'toto', expirationDate: '2021-03-15T23:01:37.925926' },
      },
    }
    const properties = { isDigital: true, hasActivationCode: true }
    const labels = getBookingLabelsV2.getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À activer avant le 15 mars 2021',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })
})
