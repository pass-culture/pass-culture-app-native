import mockdate from 'mockdate'

import { bookingsSnap } from 'features/bookings/fixtures'
import { getBookingLabels } from 'features/bookings/helpers'
import { addPrefix, formatDate } from 'features/bookings/helpers/getBookingLabels'
import { Booking } from 'features/bookings/types'

describe('getBookingLabels', () => {
  it.each`
    prefix       | date                    | expected
    ${'Dès le '} | ${'15 mars 2021'}       | ${'Dès le 15 mars 2021'}
    ${'Dès le '} | ${'Lundi 15 mars 2021'} | ${'Dès le lundi 15 mars 2021'}
  `(
    'addPrefix($date, $shouldDisplayWeekDay, $format) \t= $expected',
    ({ prefix, date, expected }) => {
      expect(addPrefix({ prefix, date })).toBe(expected)
    }
  )

  it.each`
    shouldDisplayWeekDay | format               | expected
    ${true}              | ${'day'}             | ${'Lundi 15 mars 2021'}
    ${false}             | ${'day'}             | ${'15 mars 2021'}
    ${true}              | ${'date'}            | ${'Lundi 15 mars 2021 à 18h00'}
    ${false}             | ${'date'}            | ${'15 mars 2021 à 18h00'}
    ${true}              | ${'dateWithoutYear'} | ${'Lundi 15 mars'}
    ${false}             | ${'dateWithoutYear'} | ${'15 mars'}
  `(
    'formatDate(date: "2021-03-15T18:00:00.000Z", shouldDisplayWeekDay:$shouldDisplayWeekDay, format:$format) \t= $expected',
    ({ shouldDisplayWeekDay, format, expected }) => {
      expect(
        formatDate({ date: new Date('2021-03-15T18:00:00'), shouldDisplayWeekDay, format })
      ).toBe(expected)
    }
  )

  it('should return the correct dateLabel for permanent bookings', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isPermanent: true }

    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Permanent',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
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
      dateLabel: 'Le 15 mars 2021 à 21h00',
      dayLabel: '15 mars 2021',
      hourLabel: '21h00',
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
      dateLabel: 'Le 15 mars 2021 à 21h00',
      dayLabel: '15 mars 2021',
      hourLabel: '21h00',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Aujourd’hui',
    })
  })

  it('should return the correct withdrawal date and location for events if starting tomorrow', () => {
    mockdate.set(new Date('2021-03-14T19:00:00')) // 25 hours before
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isEvent: true }

    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'Le 15 mars 2021 à 21h00',
      dayLabel: '15 mars 2021',
      hourLabel: '21h00',
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
      dateLabel: 'À retirer avant le 16 mars 2021',
      dayLabel: '',
      hourLabel: '',
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
      dayLabel: '',
      hourLabel: '',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Avant dernier jour pour retirer',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes but no expiration date', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isDigital: true, hasActivationCode: true }

    const labels = getBookingLabels(booking, properties)

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
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { expirationDate: '2021-03-15T23:01:37.925926' },
    } as unknown as Booking
    const properties = { isDigital: true, hasActivationCode: true }
    const labels = getBookingLabels(booking, properties)

    expect(labels).toEqual({
      dateLabel: 'À activer avant le 15 mars 2021',
      dayLabel: '',
      hourLabel: '',
      locationLabel: '',
      withdrawLabel: '',
    })
  })
})
