import mockdate from 'mockdate'
import { createMock } from 'ts-auto-mock'

import {
  BookingReponse,
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoryIdEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'

describe('filterBookingsWithoutReaction', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  const reactionCategories = {
    categories: [
      NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
      NativeCategoryIdEnumv2.DVD_BLU_RAY,
      NativeCategoryIdEnumv2.CD,
      NativeCategoryIdEnumv2.VINYLES,
      NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES,
      NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
      NativeCategoryIdEnumv2.LIVRES_PAPIER,
    ],
  }

  const baseBooking: BookingReponse = {
    ...bookingsSnap.ended_bookings[0],
    userReaction: null,
  }

  const subcategoriesMapping: SubcategoriesMapping =
    subcategoriesMappingSnap as SubcategoriesMapping

  it('should return false if dateUsed is missing', () => {
    const bookingWithoutDateUsed = createMock<BookingReponse>({
      userReaction: null,
    })

    const result = filterBookingsWithoutReaction(
      bookingWithoutDateUsed,
      subcategoriesMapping,
      reactionCategories
    )

    expect(result).toBe(false)
  })

  it('should return false if the subcategory is not eligible', () => {
    const bookingWithIneligibleCategory = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1).toISOString(), // More than 24 hours
      userReaction: null,
    }
    const result = filterBookingsWithoutReaction(
      bookingWithIneligibleCategory,
      subcategoriesMapping,
      reactionCategories
    )

    expect(result).toBe(false)
  })

  it('should return false if userReaction is not null', () => {
    const bookingWithUserReaction = {
      ...baseBooking,
      stock: {
        ...baseBooking.stock,
        offer: { ...baseBooking.stock.offer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
      },
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1).toISOString(), // More than 24 hours
      userReaction: ReactionTypeEnum.LIKE,
    }
    const result = filterBookingsWithoutReaction(
      bookingWithUserReaction,
      subcategoriesMapping,
      reactionCategories
    )

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
    const result = filterBookingsWithoutReaction(
      bookingWithin24Hours,
      subcategoriesMapping,
      reactionCategories
    )

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
    const result = filterBookingsWithoutReaction(
      validBooking,
      subcategoriesMapping,
      reactionCategories
    )

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
    const result = filterBookingsWithoutReaction(
      bookingWithin31Days,
      subcategoriesMapping,
      reactionCategories
    )

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
    const result = filterBookingsWithoutReaction(
      validBooking,
      subcategoriesMapping,
      reactionCategories
    )

    expect(result).toBe(true)
  })
})
