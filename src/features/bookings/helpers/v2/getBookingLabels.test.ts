import mockdate from 'mockdate'

import { ongoingBookingsV2ListSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getBookingLabelsV2 } from 'features/bookings/helpers'

describe('getBookingLabels', () => {
  const mockBooking = ongoingBookingsV2ListSnap.bookings[0]

  it('should return the correct dateLabel for permanent bookings', () => {
    const properties = { isPermanent: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels).toEqual({
      dateLabel: 'Permanent',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })

  it('should not return the location for digital bookings', () => {
    const properties = { isDigital: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels.locationLabel).toEqual('')
  })

  it('should return the correct date and location for events', () => {
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 14 mars 2024 à 20h00',
      dayLabel: '14 mars 2024',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: '',
    })
  })

  it('should return the correct withdrawal date and location for events if starting today', () => {
    mockdate.set(new Date('2024-03-14T18:00:00')) // 2 hours before
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 14 mars 2024 à 20h00',
      dayLabel: '14 mars 2024',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Billet à retirer sur place aujourd’hui',
    })
  })

  it('should return the correct withdrawal date and location for events if starting tomorrow', () => {
    mockdate.set(new Date('2024-03-13T19:00:00')) // 25 hours before
    const properties = { isEvent: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 14 mars 2024 à 20h00',
      dayLabel: '14 mars 2024',
      hourLabel: '20h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Billet à retirer sur place d’ici demain',
    })
  })

  it('should return the correct withdrawal date if expires today for physical bookings', () => {
    mockdate.set(new Date('2021-03-15T21:00:00'))
    const booking = {
      ...mockBooking,
      expirationDate: '2021-03-15T23:00:00', // expires in 2 hours
    }
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
      ...mockBooking,
      expirationDate: '2021-03-16T22:00:00', // expires in 25 hours
    }
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
    const properties = { isDigital: true, hasActivationCode: true }

    const labels = getBookingLabelsV2.getBookingLabels(mockBooking, properties)

    expect(labels).toEqual({
      dateLabel: 'À activer',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes with expiration date', () => {
    const booking = {
      ...mockBooking,
      activationCode: { code: 'toto', expirationDate: '2021-03-15T23:01:37.925926' },
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
