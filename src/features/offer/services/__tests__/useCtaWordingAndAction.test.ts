import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { CategoryIdEnum, OfferResponse, UserRole } from 'api/gen'
import { offerResponseSnap as baseOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

import { getCtaWordingAndAction } from '../useCtaWordingAndAction'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

const mockedUser = {
  email: 'jean@example.com',
  firstName: 'Jean',
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
}
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: mockedUser,
  })),
}))
const availableCategories = CATEGORY_CRITERIA

describe('getCtaWordingAndAction', () => {
  describe('Non Beneficiary', () => {
    it.each`
      isEvent  | url                     | bookedOffers                 | expected                      | disabled | isExternal
      ${true}  | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${true}  | ${'http://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${true}
      ${false} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${false} | ${'http://url-externe'} | ${{}}                        | ${"Accéder à l'offre"}        | ${false} | ${true}
      ${false} | ${undefined}            | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${true}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, isExternal }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: false,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          availableCategories,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
        expect(result?.isExternal).toEqual(isExternal)
      }
    )
  })

  // same as non beneficiary use cases, beneficiary users should not be able to book educational offers
  describe('educational offer', () => {
    it.each`
      isEvent  | url                     | bookedOffers                 | expected                      | disabled | isExternal
      ${true}  | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${true}  | ${'http://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${true}
      ${false} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${false} | ${'http://url-externe'} | ${{}}                        | ${"Accéder à l'offre"}        | ${false} | ${true}
      ${false} | ${undefined}            | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${true}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, isExternal }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url, isEducational: true })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          availableCategories,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
        expect(result?.isExternal).toEqual(isExternal)
      }
    )
  })

  describe('Beneficiary', () => {
    const getCta = (
      partialOffer: Partial<OfferResponse>,
      parameters?: Partial<Parameters<typeof getCtaWordingAndAction>[0]>,
      partialSubcategory?: Partial<Subcategory>
    ) =>
      getCtaWordingAndAction({
        isLoggedIn: true,
        isBeneficiary: true,
        offer: buildOffer(partialOffer),
        subcategory: buildSubcategory(partialSubcategory || {}),
        hasEnoughCredit: true,
        bookedOffers: {},
        availableCategories,
        isUnderageBeneficiary: true,
        ...parameters,
      }) || { wording: '' }

    it('CTA="Offre épuisée" if offer is sold out', () => {
      const { wording, onPress } = getCta({ isSoldOut: true })
      expect(wording).toEqual('Offre épuisée')
      expect(onPress === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired and sold out', () => {
      const { wording, onPress } = getCta({ isExpired: true, isSoldOut: true })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired', () => {
      const { wording, onPress } = getCta({ isExpired: true })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired', () => {
      const { wording, onPress } = getCta({ isReleased: false })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
    })

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | expected                     | disabled
      ${false} | ${true}         | ${'Réserver'}                | ${false}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $isEvent => $expected - digital offers',
      ({ disabled, expected, hasEnoughCredit, isEvent }) => {
        const { wording, onPress } = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | isDigital | expected                          | disabled
      ${false}        | ${true}   | ${'Crédit numérique insuffisant'} | ${true}
      ${true}         | ${true}   | ${'Réserver'}                     | ${false}
      ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}
      ${true}         | ${false}  | ${'Réserver'}                     | ${false}
    `(
      'check is credit is enough | non event x $isDigital => $expected',
      ({ disabled, expected, hasEnoughCredit, isDigital }) => {
        const { wording, onPress } = getCta(
          { isDigital },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | expected                     | disabled
      ${false} | ${false}        | ${'Crédit insuffisant'}      | ${true}
      ${false} | ${true}         | ${'Réserver'}                | ${false}
      ${true}  | ${false}        | ${'Crédit insuffisant'}      | ${true}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false}
    `(
      'check if Credit is enough for the category | $isEvent | creditThing=$creditThing | creditEvent=$creditEvent => $expected',
      ({ disabled, expected, hasEnoughCredit, isEvent }) => {
        const { wording, onPress } = getCta({}, { hasEnoughCredit }, { isEvent })
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | expected                          | disabled
      ${false}        | ${'Crédit numérique insuffisant'} | ${true}
      ${true}         | ${'Réserver'}                     | ${false}
    `(
      'check if Credit is enough for digital offers | creditThing=$creditThing => $expected',
      ({ disabled, expected, hasEnoughCredit }) => {
        const { wording, onPress } = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // same as beneficiaries except for video games and non free digital offers except press category
    describe('underage beneficiary', () => {
      it.each`
        isEvent  | expected                     | disabled | isDigital | categoryId                   | price
        ${false} | ${'Réserver'}                | ${false} | ${true}   | ${CategoryIdEnum.MEDIA}      | ${20}
        ${true}  | ${undefined}                 | ${true}  | ${true}   | ${CategoryIdEnum.FILM}       | ${20}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${CategoryIdEnum.FILM}       | ${0}
        ${false} | ${undefined}                 | ${true}  | ${false}  | ${CategoryIdEnum.JEU}        | ${0}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${false}  | ${CategoryIdEnum.INSTRUMENT} | ${20}
      `(
        'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent, isDigital=$isDigital, categoryId=$categoryId and price=$price',
        ({ isEvent, expected, disabled, isDigital, categoryId, price }) => {
          mockedUser.roles = [UserRole.UNDERAGEBENEFICIARY]
          const { result } = renderHook(useAvailableCategories)
          const { wording, onPress } = getCta(
            {
              isDigital,
              stocks: [
                {
                  id: 118929,
                  beginningDatetime: new Date('2021-01-04T13:30:00'),
                  isBookable: true,
                  isExpired: false,
                  isSoldOut: false,
                  price,
                },
              ],
            },
            { isUnderageBeneficiary: true, availableCategories: result.current },
            { isEvent, categoryId }
          )
          expect(wording).toEqual(expected)
          expect(onPress === undefined).toBe(disabled)
        }
      )
    })
  })

  describe('CTA - Analytics', () => {
    it('logs event ClickBookOffer when we click CTA "Réserver" (beneficiary user)', () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'http://www.google.com' })
      const subcategory = buildSubcategory({ isEvent: false })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          availableCategories,
          isUnderageBeneficiary: false,
        }) || {}

      expect(analytics.logClickBookOffer).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) onPress()
      expect(analytics.logClickBookOffer).toBeCalledTimes(1)
      expect(analytics.logClickBookOffer).toBeCalledWith(baseOffer.id)
    })

    it('logs event ConsultAvailableDates when we click CTA "Voir les disponibilités" (beneficiary user)', () => {
      const offer = buildOffer({})
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          availableCategories,
          isUnderageBeneficiary: false,
        }) || {}

      expect(analytics.logConsultAvailableDates).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) onPress()
      expect(analytics.logConsultAvailableDates).toBeCalledTimes(1)
      expect(analytics.logConsultAvailableDates).toBeCalledWith(baseOffer.id)
    })
  })
})

const buildOffer = (partialOffer: Partial<OfferResponse>): OfferResponse => ({
  ...baseOffer,
  ...partialOffer,
})

const baseSubcategory = placeholderData.subcategories[0]
const buildSubcategory = (partialSubcategory: Partial<Subcategory>): Subcategory => ({
  ...baseSubcategory,
  ...partialSubcategory,
})
