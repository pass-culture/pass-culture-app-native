import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import {
  DayMapping,
  convertToMinutes,
  getCalendarDateInfo,
  getCalendarLabels,
  getScreeningStatus,
  handleMovieCalendarScroll,
} from 'features/offerRefacto/helpers'

describe('handleMovieCalendarScroll', () => {
  const itemWidth = 100
  const flatListWidth = 400

  it('should return an offset of 0 when currentIndex is 0', () => {
    const result = handleMovieCalendarScroll(0, flatListWidth, itemWidth)

    expect(result.offset).toEqual(0)
  })

  it('should return an offset of 0 if the calculation is negative (element near the beginning)', () => {
    // shift = 400/2 - 16 = 184
    // centerOfSelectedElement = 0 * 100 + 50 = 50
    // 50 - 184 < 0 -> doit retourner 0
    const result = handleMovieCalendarScroll(0, flatListWidth, itemWidth)

    expect(result.offset).toEqual(0)
  })

  it('should calculate the correct offset to center an element in the middle of the list', () => {
    const currentIndex = 5
    const customItemWidth = 100
    const customFlatListWidth = 400

    // shift = 400 / 2 - 24 = 176
    // center = 5 * 100 + 50 = 550
    // offset = 550 - 176 = 374
    const result = handleMovieCalendarScroll(currentIndex, customFlatListWidth, customItemWidth)

    expect(result.offset).toEqual(374)
  })
})

describe('getCalendarDateInfo', () => {
  it('should return calendar date info for a given date', () => {
    const date = new Date('2026-01-20T00:00:00.000Z')
    const result = getCalendarDateInfo(date)

    expect(result).toEqual({
      shortWeekDay: 'Mar.',
      fullWeekDay: 'Mardi',
      dayDate: 20,
      shortMonth: 'Janv.',
      fullMonth: 'Janvier',
      timestamp: date.getTime(),
    })
  })
})

describe('getCalendarLabels', () => {
  it('should return correct labels for desktop view', () => {
    const dateInfo: DayMapping = {
      shortWeekDay: 'Mar.',
      fullWeekDay: 'Mardi',
      dayDate: 20,
      shortMonth: 'Janv.',
      fullMonth: 'Janvier',
      timestamp: 1234567890,
    }

    const result = getCalendarLabels(dateInfo, true)

    expect(result).toEqual({
      accessibilityLabel: 'Mardi 20 Janvier',
      weekDay: 'Mardi',
      month: 'Janvier',
    })
  })

  it('should return correct labels for mobile view', () => {
    const dateInfo: DayMapping = {
      shortWeekDay: 'Mar.',
      fullWeekDay: 'Mardi',
      dayDate: 20,
      shortMonth: 'Janv.',
      fullMonth: 'Janvier',
      timestamp: 1234567890,
    }

    const result = getCalendarLabels(dateInfo, false)

    expect(result).toEqual({
      accessibilityLabel: 'Mardi 20 Janvier',
      weekDay: 'Mar.',
      month: 'Janv.',
    })
  })
})

describe('getScreeningStatus', () => {
  it('should return UNAVAILABLE status when external bookings are disabled', () => {
    const result = getScreeningStatus({
      stock: offerStockResponseSnap,
      isExternalBookingsDisabled: true,
    })

    expect(result).toEqual({
      subtitleLeft: EventCardSubtitleEnum.UNAVAILABLE,
      isDisabled: true,
    })
  })

  it('should return FULLY_BOOKED when screening is sold out and user is logged in with credit', () => {
    const userData: MovieScreeningUserData = {
      isUserLoggedIn: true,
      hasEnoughCredit: true,
    }

    const result = getScreeningStatus({
      stock: { ...offerStockResponseSnap, isSoldOut: true },
      userData,
    })

    expect(result).toEqual({
      subtitleLeft: EventCardSubtitleEnum.FULLY_BOOKED,
      isDisabled: true,
    })
  })

  it('should return ALREADY_BOOKED when the user has already booked this specific screening', () => {
    const result = getScreeningStatus({ stock: offerStockResponseSnap, hasBookedScreening: true })

    expect(result).toEqual({
      subtitleLeft: EventCardSubtitleEnum.ALREADY_BOOKED,
      isDisabled: true,
    })
  })

  describe('Eligibility and Credit constraints (returning features as subtitle)', () => {
    it('should disable booking and show features when user credit is expired', () => {
      const userData: MovieScreeningUserData = { isUserCreditExpired: true }
      const result = getScreeningStatus({
        stock: { ...offerStockResponseSnap, features: ['VOST', '3D'] },
        userData,
      })

      expect(result).toEqual({
        subtitleLeft: 'VOST, 3D',
        isDisabled: true,
      })
    })

    it('should disable booking when the user is not eligible', () => {
      const userData: MovieScreeningUserData = { isUserEligible: false }
      const result = getScreeningStatus({ stock: offerStockResponseSnap, userData })

      expect(result.isDisabled).toEqual(true)
    })

    it('should disable booking when user has already booked an offer at the same venue', () => {
      const userData: MovieScreeningUserData = {
        hasBookedOffer: true,
      }
      const result = getScreeningStatus({
        stock: offerStockResponseSnap,
        userData,
        isSameVenue: true,
      })

      expect(result.isDisabled).toEqual(true)
    })
  })

  it('should return NOT_ENOUGH_CREDIT when user is logged in, has no credit and completed subscription', () => {
    const userData: MovieScreeningUserData = {
      isUserLoggedIn: true,
      hasEnoughCredit: false,
      hasNotCompletedSubscriptionYet: false,
    }

    const result = getScreeningStatus({ stock: offerStockResponseSnap, userData })

    expect(result).toEqual({
      subtitleLeft: EventCardSubtitleEnum.NOT_ENOUGH_CREDIT,
      isDisabled: true,
    })
  })

  it('should return features and isDisabled: false for the default nominal case', () => {
    const userData: MovieScreeningUserData = {
      isUserLoggedIn: true,
      hasEnoughCredit: true,
      isUserEligible: true,
    }

    const result = getScreeningStatus({
      stock: { ...offerStockResponseSnap, features: ['VOST', '3D'] },
      userData,
    })

    expect(result).toEqual({
      subtitleLeft: 'VOST, 3D',
      isDisabled: false,
    })
  })
})

describe('convertToMinutes', () => {
  it('should convert correctly a standard format', () => {
    expect(convertToMinutes('1h30')).toEqual(90)
    expect(convertToMinutes('2h00')).toEqual(120)
    expect(convertToMinutes('0h45')).toEqual(45)
  })

  it('should convert correctly large hour numbers', () => {
    expect(convertToMinutes('10h00')).toEqual(600)
    expect(convertToMinutes('24h30')).toEqual(1470)
  })

  it('should return 0 for an empty string', () => {
    expect(convertToMinutes('')).toEqual(0)
  })

  it('should return 0 if the format is invalid (no "h")', () => {
    expect(convertToMinutes('120')).toEqual(0)
  })
})
