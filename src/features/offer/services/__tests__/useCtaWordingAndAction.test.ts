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
    isLoggedIn | isBeneficiary | offerCategoryType     | stocks               | isActive | externalTicketOfficeUrl | expectedWording                       | expectedOnPress
    ${false}   | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${'Accéder à la billetterie externe'} | ${true}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${'Accéder à la billetterie externe'} | ${true}
    ${false}   | ${false}      | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${'Accéder à la billetterie externe'} | ${true}
    ${false}   | ${false}      | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${null}                 | ${'Accéder à la billetterie externe'} | ${undefined}
    ${true}    | ${false}      | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${'Accéder à la billetterie externe'} | ${true}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${"Accéder à l'offre"}                | ${true}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${"Accéder à l'offre"}                | ${true}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${"Accéder à l'offre"}                | ${true}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${"Accéder à l'offre"}                | ${true}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${undefined}            | ${"Accéder à l'offre"}                | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${'Voir les disponibilités'}          | ${true}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${'Voir les disponibilités'}          | ${true}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[soldOutStock]}    | ${true}  | ${'https://test.com'}   | ${'Offre épuisée'}                    | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[soldOutStock]}    | ${true}  | ${'https://test.com'}   | ${'Offre épuisée'}                    | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${'Offre expirée'}                    | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[expiredStock1]}   | ${true}  | ${'https://test.com'}   | ${'Offre expirée'}                    | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${[soldOutStock]}    | ${false} | ${'https://test.com'}   | ${'Offre expirée'}                    | ${undefined}
    ${true}    | ${true}       | ${CategoryType.Event} | ${[soldOutStock]}    | ${false} | ${'https://test.com'}   | ${'Offre expirée'}                    | ${undefined}
    ${null}    | ${true}       | ${CategoryType.Thing} | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${null}                               | ${undefined}
    ${true}    | ${true}       | ${null}               | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${null}                               | ${undefined}
    ${true}    | ${true}       | ${null}               | ${[notExpiredStock]} | ${true}  | ${'https://test.com'}   | ${null}                               | ${undefined}
  `(
    'should return $expectedWording if isLoggedIn: $isLoggedIn, isBeneficiary: $isBeneficiary, offerCategoryType: $OfferCategoryType, isActive: $isActive',
    ({
      isLoggedIn,
      isBeneficiary,
      offerCategoryType,
      stocks,
      isActive,
      externalTicketOfficeUrl,
      expectedWording,
      expectedOnPress,
    }: {
      isLoggedIn: boolean
      isBeneficiary: boolean
      offerCategoryType: CategoryType
      stocks: OfferStockResponse
      isActive: boolean
      externalTicketOfficeUrl: string | undefined
      expectedWording: string
      expectedOnPress: (() => void) | undefined
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
            externalTicketOfficeUrl: externalTicketOfficeUrl,
          },
        },
      })
      expect(result.current.wording).toBe(expectedWording)
      expectedOnPress === undefined
        ? expect(result.current.onPress).toBeUndefined()
        : expect(result.current.onPress).toBeTruthy()
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
