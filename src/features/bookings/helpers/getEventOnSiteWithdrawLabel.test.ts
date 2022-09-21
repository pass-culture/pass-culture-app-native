import { t } from '@lingui/macro'
import { addDays, formatISO } from 'date-fns'
import mockdate from 'mockdate'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getEventOnSiteWithdrawLabel } from 'features/bookings/helpers'

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

mockdate.set(initialBookingEventDate)

describe('getEventOnSiteWithdrawLabel', () => {
  describe('without withdrawal delay informed', () => {
    it('should return "Billet à retirer sur place" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place`)
    })

    it('should return "Billet à retirer sur place" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place`)
    })

    it(`should return "Billet à retirer sur place d'ici demain" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place d'ici demain`)
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 0)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place aujourd'hui`)
    })
  })

  describe('with withdrawal delay less than 24 hours', () => {
    it('should return "Billet à retirer sur place dans 3 jours" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dans 3 jours`)
    })

    it('should return "Billet à retirer sur place dans 2 jours" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dans 2 jours`)
    })

    it(`should return "Billet à retirer sur place demain" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place demain`)
    })

    it(`should return "Billet à retirer sur place dès 18h30" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 2)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès` + ' 18h30')
    })
  })

  describe('with 24 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dans 2 jours" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dans 2 jours`)
    })

    it('should return "Billet à retirer sur place dès demain" if event in 2 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès demain`)
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès aujourd'hui`)
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 24)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place aujourd'hui`)
    })
  })

  describe('with 48 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dès demain" if event in 3 days', () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn3Days, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès demain`)
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event in 2 days`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingEventIn2Days, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès aujourd'hui`)
    })

    it(`should return "Billet à retirer sur place dès aujourd'hui" if event is tomorrow`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTomorrowEvent, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place dès aujourd'hui`)
    })

    it(`should return "Billet à retirer sur place aujourd'hui" if event is today`, () => {
      const booking = getBookingWithWithdrawalDelay(bookingTodayEvent, 60 * 60 * 48)

      const message = getEventOnSiteWithdrawLabel(booking.stock)
      expect(message).toEqual(t`Billet à retirer sur place aujourd'hui`)
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
