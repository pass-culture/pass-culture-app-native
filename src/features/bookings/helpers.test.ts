import { addDays, formatISO } from 'date-fns'
import mockdate from 'mockdate'

import { SettingsResponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { Booking } from 'features/bookings/components/types'
import {
  formatSecondsToString,
  getBookingLabelForActivationCode,
  getBookingLabels,
  getBookingProperties,
  getEventOnSiteWithdrawLabel,
  getOfferRules,
} from 'features/bookings/helpers'

describe('getBookingLabelForActivationCode', () => {
  it('should display the date in the label', () => {
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { expirationDate: '2021-03-15T23:01:37.925926' },
    } as unknown as Booking

    const label = getBookingLabelForActivationCode(booking)
    expect(label).toEqual('À activer avant le 15 mars 2021')
  })

  it.each([{ activationCode: { expirationDate: '' } }, { activationCode: {} }, {}])(
    'should only display "A activer"',
    (activationCodeField) => {
      const booking = {
        ...bookingsSnap.ongoing_bookings[0],
        ...activationCodeField,
      } as unknown as Booking
      const label = getBookingLabelForActivationCode(booking)

      expect(label).toEqual('À activer')
    }
  )
})

describe('getBookingLabels', () => {
  beforeEach(jest.clearAllMocks)

  it('should return the correct dateLabel for permanent bookings', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isPermanent: true }
    const labels = getBookingLabels(booking, properties, null)

    expect(labels).toEqual({ dateLabel: 'Permanent', locationLabel: '', withdrawLabel: '' })
  })

  it('should not return the location for digital bookings', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isDigital: true }
    const labels = getBookingLabels(booking, properties, null)

    expect(labels.locationLabel).toEqual('')
  })

  it('should return the correct date and location for events', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isEvent: true }
    const labels = getBookingLabels(booking, properties, null)

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
    const labels = getBookingLabels(booking, properties, null)

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
    const labels = getBookingLabels(booking, properties, null)

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
    const labels = getBookingLabels(booking, properties, null)

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
    const labels = getBookingLabels(booking, properties, null)

    expect(labels).toEqual({
      dateLabel: 'À retirer avant le 16 mars 2021',
      locationLabel: 'Maison de la Brique, Drancy',
      withdrawLabel: 'Avant dernier jour pour retirer',
    })
  })

  it('should return the correct dateLabel for digital bookings with activation codes but no expiration date', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const properties = { isDigital: true, hasActivationCode: true }
    const settings = { autoActivateDigitalBookings: true } as SettingsResponse
    const labels = getBookingLabels(booking, properties, settings)

    expect(labels).toEqual({ dateLabel: 'À activer', locationLabel: '', withdrawLabel: '' })
  })

  it('should return the correct dateLabel for digital bookings with activation codes with expiration date', () => {
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { expirationDate: '2021-03-15T23:01:37.925926' },
    } as unknown as Booking
    const properties = { isDigital: true, hasActivationCode: true }
    const settings = { autoActivateDigitalBookings: true } as SettingsResponse
    const labels = getBookingLabels(booking, properties, settings)

    expect(labels).toEqual({
      dateLabel: 'À activer avant le 15 mars 2021',
      locationLabel: '',
      withdrawLabel: '',
    })
  })
})

describe('getBookingProperties', () => {
  it('when an event booking is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: null,
    } as Booking

    const isEvent = true

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: true,
      isPhysical: false,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: false,
    })
  })

  it('when a physical booking is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: null,
    } as Booking

    const isEvent = false

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: false,
      isPhysical: true,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: false,
    })
  })

  it('when a booking with activation code is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: { code: 'toto' },
    } as Booking

    const isEvent = false

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: false,
      isPhysical: true,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: true,
    })
  })

  describe('when duo', () => {
    it('with an event', () => {
      const booking = {
        stock: { offer: { isDigital: true, isPermanent: true } },
        quantity: 2,
      } as Booking

      const isEvent = true

      const bookingProperties = getBookingProperties(booking, isEvent)

      expect(bookingProperties).toEqual({
        isDuo: true,
        isEvent: true,
        isPhysical: false,
        isDigital: true,
        isPermanent: true,
        hasActivationCode: false,
      })
    })

    it('with an non-event', () => {
      const booking = {
        stock: { offer: { isDigital: true, isPermanent: true } },
        quantity: 2,
      } as Booking

      const isEvent = false

      const bookingProperties = getBookingProperties(booking, isEvent)

      expect(bookingProperties).toEqual({
        isDuo: true,
        isEvent: false,
        isPhysical: true,
        isDigital: true,
        isPermanent: true,
        hasActivationCode: false,
      })
    })
  })
})

describe('formatSecondsToString', () => {
  describe('should display withdrawal wording', () => {
    it.each([1, 60 * 30])('In minutes', (delay) => {
      mockdate.set(new Date('2022-04-22T17:30:00'))
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60} minutes`)
    })

    it('In hour', () => {
      const message = formatSecondsToString(3600)
      expect(message).toEqual('1 heure')
    })

    it.each([60 * 60 * 2, 60 * 60 * 48])('In hours', (delay) => {
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60 / 60} heures`)
    })

    it.each([60 * 60 * 24 * 3, 60 * 60 * 24 * 6])('In days', (delay) => {
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60 / 60 / 24} jours`)
    })

    it('In week', () => {
      const message = formatSecondsToString(60 * 60 * 24 * 7)
      expect(message).toEqual('1 semaine')
    })
  })
})

describe('getEventOnSiteWithdrawLabel', () => {
  const initialBooking: Booking = {
    ...bookingsSnap.ongoing_bookings[0],
    stock: {
      ...bookingsSnap.ongoing_bookings[0].stock,
      beginningDatetime: '2022-04-22T20:30:00',
      offer: {
        ...bookingsSnap.ongoing_bookings[0].stock.offer,
        subcategoryId: SubcategoryIdEnum.CONCERT,
        withdrawalType: WithdrawalTypeEnum.on_site,
      },
    },
  }
  const initialBookingEventDate = new Date('2022-04-22T20:30:00')

  const bookingEventIn3Days = {
    ...initialBooking,
    stock: {
      ...initialBooking.stock,
      beginningDatetime: formatISO(addDays(new Date(initialBookingEventDate), 3)).slice(0, -1),
      offer: {
        ...initialBooking.stock.offer,
      },
    },
  }

  const bookingEventIn2Days = {
    ...initialBooking,
    stock: {
      ...initialBooking.stock,
      beginningDatetime: formatISO(addDays(new Date(initialBookingEventDate), 2)).slice(0, -1),
      offer: {
        ...initialBooking.stock.offer,
      },
    },
  }

  const bookingTomorrowEvent = {
    ...initialBooking,
    stock: {
      ...initialBooking.stock,
      beginningDatetime: formatISO(addDays(new Date(initialBookingEventDate), 1)).slice(0, -1),
      offer: {
        ...initialBooking.stock.offer,
      },
    },
  }

  const bookingTodayEvent = {
    ...initialBooking,
    stock: {
      ...initialBooking.stock,
      beginningDatetime: formatISO(new Date(initialBookingEventDate)).slice(0, -1),
      offer: {
        ...initialBooking.stock.offer,
      },
    },
  }

  describe('without withdrawal delay informed', () => {
    it('should return "Billet à retirer sur place" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place')
    })

    it('should return "Billet à retirer sur place" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place')
    })

    it(`should return "Billet à retirer sur place d'ici demain" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place d’ici demain')
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  describe('with withdrawal delay less than 24 hours', () => {
    it('should return "Billet à retirer sur place dans 3 jours" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dans 3 jours')
    })

    it('should return "Billet à retirer sur place dans 2 jours" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dans 2 jours')
    })

    it(`should return "Billet à retirer sur place demain" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place demain')
    })

    it(`should return "Billet à retirer sur place dès 18h30" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès 18h30')
    })
  })

  describe('with 24 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dans 2 jours" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dans 2 jours')
    })

    it('should return "Billet à retirer sur place dès demain" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès demain')
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  describe('with 48 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dès demain" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès demain')
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event in 2 days`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  it('should return an empty string if the event will start in more than 3 days', () => {
    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        beginningDatetime: formatISO(addDays(new Date(initialBookingEventDate), 4)).slice(0, -1),
        offer: {
          ...initialBooking.stock.offer,
        },
      },
    }

    const message = getEventOnSiteWithdrawLabel(booking.stock)

    expect(message).toEqual('')
  })

  it('should return an empty string if the event has started', () => {
    mockdate.set(new Date('2022-04-22T20:30:01'))
    const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 48)

    const message = getEventOnSiteWithdrawLabel(booking.stock)
    mockdate.reset()
    expect(message).toEqual('')
  })
})

function getBookingWithWithdrawalDelay(booking: Booking, withdrawalDelay: number) {
  return {
    ...booking,
    stock: {
      ...booking.stock,
      offer: {
        ...booking.stock.offer,
        withdrawalDelay,
      },
    },
  }
}

describe('getOfferRules', () => {
  const booking = bookingsSnap.ongoing_bookings[1]

  it('should return the correct message if hasActivationCode && activationCodeFeatureEnabled', () => {
    const properties = {
      hasActivationCode: true,
      isDigital: false,
      isPhysical: false,
      isEvent: false,
    }
    const activationCodeFeatureEnabled = true
    const offerRules = getOfferRules(properties, undefined, activationCodeFeatureEnabled)
    expect(offerRules).toEqual(
      'Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if isDigital', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: true,
      isPhysical: false,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual(
      'Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if isPhysical', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: true,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it.each([WithdrawalTypeEnum.on_site, null])(
    'should not return message if isEvent and %s withdrawal type',
    (withdrawalType) => {
      const properties = {
        hasActivationCode: false,
        isDigital: false,
        isPhysical: false,
        isEvent: true,
      }
      const newBooking = {
        ...booking,
        externalBookings: [],
        stock: {
          ...booking.stock,
          offer: { ...booking.stock.offer, withdrawalType },
        },
      }
      const offerRules = getOfferRules(properties, newBooking)
      expect(offerRules).toEqual(
        'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    }
  )

  it.each([WithdrawalTypeEnum.no_ticket, WithdrawalTypeEnum.by_email])(
    'should not return message if isEvent and %s withdrawal type',
    (withdrawalType) => {
      const properties = {
        hasActivationCode: false,
        isDigital: false,
        isPhysical: false,
        isEvent: true,
      }
      const newBooking = {
        ...booking,
        externalBookings: [],
        stock: {
          ...booking.stock,
          offer: { ...booking.stock.offer, withdrawalType },
        },
      }
      const offerRules = getOfferRules(properties, newBooking)
      expect(offerRules).toEqual('')
    }
  )

  it('should return the correct message if externalBookingsInfos.length === 1', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: true,
      isEvent: false,
    }
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    const offerRules = getOfferRules(properties, booking)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce QR code. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if externalBookingsInfos.length === 2', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: false,
      isEvent: true,
    }
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    const offerRules = getOfferRules(properties, booking)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ces QR codes. N’oublie pas que tu n’as pas le droit de les revendre ou les céder.'
    )
  })

  it('should return an empty string if isEvent, isPhysical, isDigital and hasActivationCode are false', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: false,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual('')
  })
})
