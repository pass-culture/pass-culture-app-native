import mockdate from 'mockdate'

import { SubcategoryIdEnum } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { buildBookingSurveyUrl } from 'features/bookings/helpers/buildBookingSurveyUrl'
import { beneficiaryUser } from 'fixtures/user'

mockdate.set(CURRENT_DATE)

describe('buildBookingSurveyUrl', () => {
  it('should set BookingType param to solo when booking is not duo', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 1,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('BookingType')).toBe('solo')
  })

  it('should set BookingType param to duo when booking is duo', () => {
    const url = buildBookingSurveyUrl({
      isDuo: true,
      numberOfBookings: 1,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('BookingType')).toBe('duo')
  })

  it('should set IsFirstBooking param to true when user has only made one booking', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 1,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('IsFirstBooking')).toBe('true')
  })

  it('should set IsFirstBooking param to true when user has made more than one booking', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 2,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('IsFirstBooking')).toBe('false')
  })

  it('should set BookingCategory param', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 2,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('BookingCategory')).toBe(SubcategoryIdEnum.SEANCE_CINE)
  })

  it('should set UserAge param', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 2,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('UserAge')).toBe('18')
  })

  it('should set DepositActivationDate param', () => {
    const url = buildBookingSurveyUrl({
      isDuo: false,
      numberOfBookings: 2,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      user: beneficiaryUser,
    })

    expect(url.searchParams.get('DepositActivationDate')).toBe('2021-11-19T11:00:00Z')
  })
})
