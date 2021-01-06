import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { CategoryType, OfferStockResponse } from 'api/gen'

import { useAuthContext } from '../../../auth/AuthContext'
import { useUserProfileInfo } from '../../../home/api'
import { useCtaWordingAndAction, isOfferExpired, isOfferSoldOut } from '../useCtaWordingAndAction'
import {
  expiredOffer,
  notExpiredOffer,
  notExpiredOfferNoLimitDate,
  expiredStock1,
  notExpiredStock,
  soldOutStock,
  soldOutOffer,
  notSoldOutOffer,
} from '../useCtaWordingAndAction.testsFixtures'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

jest.mock('features/auth/AuthContext')
jest.mock('features/home/api')
const mockedUseAuthContext = useAuthContext as jest.Mock
const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock
describe('useCtaWordingAndAction', () => {
  // Note that isLoggedIn === false => isBeneficiary === false
  it.each`
    isLoggedIn | isBeneficiary | offerCategoryType     | stocks               | isActive | expectedWording
    ${false}   | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${"Accéder à l'offre"}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${"Accéder à l'offre"}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[soldOutStock]}    | ${true}  | ${'Offre épuisée'}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[soldOutStock]}    | ${true}  | ${'Offre épuisée'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${'Offre expirée'}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'Offre expirée'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[soldOutStock]}    | ${false} | ${'Offre expirée'}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[soldOutStock]}    | ${false} | ${'Offre expirée'}
    ${null}    | ${true}       | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${null}
    ${true}    | ${true}       | ${null}               | ${[notExpiredStock]} | ${true}  | ${null}
    ${true}    | ${true}       | ${null}               | ${[notExpiredStock]} | ${true}  | ${null}
  `(
    'should return $expectedWording if isLoggedIn: $isLoggedIn, isBeneficiary: $isBeneficiary, offerCategoryType: $OfferCategoryType, isActive: $isActive',
    ({
      isLoggedIn,
      isBeneficiary,
      offerCategoryType,
      stocks,
      isActive,
      expectedWording,
    }: {
      isLoggedIn: boolean
      isBeneficiary: boolean
      offerCategoryType: CategoryType
      stocks: OfferStockResponse
      isActive: boolean
      expectedWording: string
    }) => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))
      mockedUseUserProfileInfo.mockImplementationOnce(() =>
        isLoggedIn ? { data: { isBeneficiary } } : { data: undefined }
      )
      const { result, unmount } = renderHook(useCtaWordingAndAction, {
        initialProps: {
          offer: {
            // @ts-ignore only category and stocks needed for test
            category: { categoryType: offerCategoryType },
            // @ts-ignore only category and stocks needed for test
            stocks: stocks,
            isActive: isActive,
          },
        },
      })
      expect(result.current.wording).toBe(expectedWording)
      unmount()
    }
  )
})

describe('isOfferExpired', () => {
  it.each`
    offer                         | isExpired
    ${expiredOffer}               | ${true}
    ${notExpiredOffer}            | ${false}
    ${notExpiredOfferNoLimitDate} | ${false}
  `('should check offer expiration correctlty', ({ offer, isExpired }) => {
    expect(isOfferExpired(offer)).toEqual(isExpired)
  })
})

describe('isOfferSoldOut', () => {
  it.each`
    offer              | isSoldOut
    ${soldOutOffer}    | ${true}
    ${notSoldOutOffer} | ${false}
  `('should check offer expiration correctlty', ({ offer, isSoldOut }) => {
    expect(isOfferSoldOut(offer)).toEqual(isSoldOut)
  })
})
