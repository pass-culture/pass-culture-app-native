import mockdate from 'mockdate'

import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getBookingLabels } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'

describe('getBookingLabels', () => {
  beforeEach(jest.clearAllMocks)

  it('should return the correct dateLabel for permanent bookings', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isPermanent: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({ dateLabel: 'Permanent', locationLabel: '', withdrawLabel: '' })
  })

  it('should not return the location for digital bookings', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isDigital: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels.locationLabel).toEqual('')
  })

  it('should return the correct date and location for events', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isEvent: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: '',
    })
  })

  it('should return the correct withdrawal date and location for events if starting today', () => {
    mockdate.set(new Date('2021-03-15T18:00:00')) // 2 hours before
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isEvent: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: "Aujourd'hui",
    })
  })

  it('should return the correct withdrawal date and location for events if starting tomorrow', () => {
    mockdate.set(new Date('2021-03-14T19:00:00')) // 25 hours before
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isEvent: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Demain',
    })
  })

  it('should return the correct withdrawal date if expires today for physical bookings', () => {
    mockdate.set(new Date('2021-03-15T21:00:00'))
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      expirationDate: '2021-03-15T23:00:00', // expires in 2 hours
    } as unknown as Booking
    const properties = { isPhysical: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À retirer avant le 15 mars 2021',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Dernier jour pour retirer',
    })
  })

  it('should return the correct withdrawal date if expires tomorrow for physical bookings', () => {
    mockdate.set(new Date('2021-03-15T21:00:00'))
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      expirationDate: '2021-03-16T22:00:00', // expires in 25 hours
    } as unknown as Booking
    const properties = { isPhysical: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À retirer avant le 16 mars 2021',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Avant dernier jour pour retirer',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes but no expiration date', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isDigital: true, hasActivationCode: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({ dateLabel: 'À activer', locationLabel: '', withdrawLabel: '' })
  })

  it('should return the correct dateLabel for digital bookings with activation codes with expiration date', () => {
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { expirationDate: '2021-03-15T23:01:37.925926' },
    } as unknown as Booking
    const properties = { isDigital: true, hasActivationCode: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À activer avant le 15 mars 2021',
      locationLabel: '',
      withdrawLabel: '',
    })
  })
})
