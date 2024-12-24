import mockdate from 'mockdate'

import { AvailableReactionBooking, BookingReponse, SubcategoryIdEnum } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'

const baseAvailableBooking: AvailableReactionBooking = {
  name: 'Product 6',
  offerId: 147874,
  subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
  image: null,
  dateUsed: '2024-12-23T14:09:21.057979Z',
}

describe('filterBookingsWithoutReaction', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  const baseBooking: BookingReponse = {
    ...bookingsSnap.ended_bookings[0],
    userReaction: null,
  }

  it('should return false if there are not reactable bookings', () => {
    const bookingWithoutDateUsed = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
      },
      dateUsed: null,
      userReaction: null,
    }

    const result = filterBookingsWithoutReaction(bookingWithoutDateUsed)

    expect(result).toBe(false)
  })

  it('should return false if dateUsed is missing', () => {
    const bookingWithoutDateUsed = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
      },
      dateUsed: null,
      userReaction: null,
    }

    const availableReactionsSnapWithoutDateUsed = {
      ...baseAvailableBooking,
      dateUsed: null,
    }
    const result = filterBookingsWithoutReaction(bookingWithoutDateUsed, [
      availableReactionsSnapWithoutDateUsed,
    ])

    expect(result).toBe(false)
  })

  it('should return false if elapsed time is less than 24 hours for SEANCES_DE_CINEMA', () => {
    const bookingWithin24Hours = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1).toISOString(), // Less than 24 hours
      userReaction: null,
    }

    const availableReactionsCinemaOfferSnap = {
      ...baseAvailableBooking,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1).toISOString(), // Less than 24 hours
    }

    const result = filterBookingsWithoutReaction(bookingWithin24Hours, [
      availableReactionsCinemaOfferSnap,
    ])

    expect(result).toBe(false)
  })

  it('should return true if elapsed time is more than 24 hours for SEANCES_DE_CINEMA', () => {
    const validBooking = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1).toISOString(), // More than 24 hours
      userReaction: null,
    }

    const availableReactionsCinemaOfferSnap = {
      ...baseAvailableBooking,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1).toISOString(), // More than 24 hours
    }

    const result = filterBookingsWithoutReaction(validBooking, [availableReactionsCinemaOfferSnap])

    expect(result).toBe(true)
  })

  it('should return false if elapsed time is less than 31 days for eligible categories', () => {
    const bookingWithin31Days = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - 30 * TWENTY_FOUR_HOURS).toISOString(), // Less than 31 days
      userReaction: null,
    }

    const availableReactionsBookOfferSnap = {
      ...baseAvailableBooking,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      dateUsed: new Date(CURRENT_DATE.getTime() - 30 * TWENTY_FOUR_HOURS).toISOString(), // Less than 31 days
    }

    const result = filterBookingsWithoutReaction(bookingWithin31Days, [
      availableReactionsBookOfferSnap,
    ])

    expect(result).toBe(false)
  })

  it('should return true if elapsed time is more than 31 days for eligible categories and all conditions are met', () => {
    const validBooking = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - 31 * TWENTY_FOUR_HOURS - 1).toISOString(), // More than 31 days
      userReaction: null,
    }

    const availableReactionsBookOfferSnap = {
      ...baseAvailableBooking,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      dateUsed: new Date(CURRENT_DATE.getTime() - 31 * TWENTY_FOUR_HOURS - 1).toISOString(), // More than 31 days
    }

    const result = filterBookingsWithoutReaction(validBooking, [availableReactionsBookOfferSnap])

    expect(result).toBe(true)
  })
})
