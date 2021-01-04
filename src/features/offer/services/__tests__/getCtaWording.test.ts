import { CategoryType } from 'api/gen'

import { getCtaWording } from '../getCtaWording'

describe('getCtaWording', () => {
  // Note that isLoggedIn === false => isBeneficiary === false
  it.each`
    isLoggedIn | isBeneficiary | offerCategoryType     | expectedWording
    ${false}   | ${false}      | ${CategoryType.Event} | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${"Accéder à l'offre"}
    ${true}    | ${true}       | ${CategoryType.Event} | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${'Voir les disponibilités'}
  `(
    'should return $expectedWording if isLoggedIn: $isLoggedIn, isBeneficiary: $isBeneficiary, offerCategoryType: $OfferCategoryType',
    ({
      isLoggedIn,
      isBeneficiary,
      offerCategoryType,
      expectedWording,
    }: {
      isLoggedIn: boolean
      isBeneficiary: boolean
      offerCategoryType: CategoryType
      expectedWording: string
    }) => {
      const result = getCtaWording({
        categoryType: offerCategoryType,
        isLoggedIn,
        isBeneficiary,
      })
      expect(result).toBe(expectedWording)
    }
  )
})
