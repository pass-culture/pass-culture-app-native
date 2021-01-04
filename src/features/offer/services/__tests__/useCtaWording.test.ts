import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { CategoryType, OfferStockResponse } from 'api/gen'

import { useAuthContext } from '../../../auth/AuthContext'
import { useUserProfileInfo } from '../../../home/api'
import { useCtaWording, isOfferExpired } from '../useCtaWording'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

jest.mock('features/auth/AuthContext')
jest.mock('features/home/api')
const mockedUseAuthContext = useAuthContext as jest.Mock
const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock
describe('useCtaWording', () => {
  const notExpiredStock = {
    id: 118929,
    beginningDatetime: new Date('2021-01-01T13:30:00'),
    bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
    price: 5,
    isBookable: true,
  }
  const expiredStock = {
    id: 118929,
    beginningDatetime: new Date('2021-01-01T13:30:00'),
    bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
    price: 5,
    isBookable: true,
  }

  // Note that isLoggedIn === false => isBeneficiary === false
  it.each`
    isLoggedIn | isBeneficiary | offerCategoryType     | stocks               | expectedWording
    ${false}   | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Event} | ${[expiredStock]}    | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[expiredStock]}    | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${"Accéder à l'offre"}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[expiredStock]}    | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[expiredStock]}    | ${"Accéder à l'offre"}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[notExpiredStock]} | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[notExpiredStock]} | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[expiredStock]}    | ${'Offre expirée'}
  `(
    'should return $expectedWording if isLoggedIn: $isLoggedIn, isBeneficiary: $isBeneficiary, offerCategoryType: $OfferCategoryType',
    ({
      isLoggedIn,
      isBeneficiary,
      offerCategoryType,
      stocks,
      expectedWording,
    }: {
      isLoggedIn: boolean
      isBeneficiary: boolean
      offerCategoryType: CategoryType
      stocks: OfferStockResponse
      expectedWording: string
    }) => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))
      mockedUseUserProfileInfo.mockImplementationOnce(() =>
        isLoggedIn ? { data: { isBeneficiary } } : { data: undefined }
      )
      const { result, unmount } = renderHook(useCtaWording, {
        initialProps: {
          offer: {
            // @ts-ignore only category and stocks needed for test
            category: { categoryType: offerCategoryType },
            // @ts-ignore only category and stocks needed for test
            stocks: stocks,
          },
        },
      })
      expect(result.current).toBe(expectedWording)
      unmount()
    }
  )
})

describe('isOfferExpired', () => {
  const expiredOffer = {
    stocks: [
      {
        id: 118929,
        beginningDatetime: new Date('2021-01-01T13:30:00'),
        bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
        price: 5,
        isBookable: true,
      },
      {
        id: 118928,
        beginningDatetime: new Date('2021-01-02T18:00:00'),
        bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
        price: 5,
        isBookable: true,
      },
    ],
  }
  const notExpiredOffer1 = {
    stocks: [
      {
        id: 118929,
        beginningDatetime: new Date('2021-01-01T13:30:00'),
        bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
        price: 5,
        isBookable: true,
      },
      {
        id: 118928,
        beginningDatetime: new Date('2021-01-02T18:00:00'),
        bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
        price: 5,
        isBookable: true,
      },
    ],
  }
  const notExpiredOffer2 = {
    stocks: [
      {
        id: 118929,
        beginningDatetime: new Date('2021-01-01T13:30:00'),
        bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
        price: 5,
        isBookable: true,
      },
      {
        id: 118928,
        beginningDatetime: new Date('2021-01-02T18:00:00'),
        price: 5,
        isBookable: true,
      },
    ],
  }

  it.each`
    offer               | isExpired
    ${expiredOffer}     | ${true}
    ${notExpiredOffer1} | ${false}
    ${notExpiredOffer2} | ${false}
  `('should check offer expiration correctlty', ({ offer, isExpired }) => {
    expect(isOfferExpired(offer)).toEqual(isExpired)
  })
})
