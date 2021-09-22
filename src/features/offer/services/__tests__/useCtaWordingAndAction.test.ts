import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { CategoryIdEnum, CategoryType, UserRole } from 'api/gen'
import { offerAdaptedResponseSnap as baseOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { analytics } from 'libs/analytics'

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
      type                  | url                     | bookedOffers                 | expected                      | disabled | isExternal
      ${CategoryType.Event} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Event} | ${'http://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${true}
      ${CategoryType.Thing} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Thing} | ${'http://url-externe'} | ${{}}                        | ${"Accéder à l'offre"}        | ${false} | ${true}
      ${CategoryType.Thing} | ${undefined}            | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${true}
    `(
      'CTA(disabled=$disabled) = "$expected" for categoryType=$type and url=$url',
      ({ disabled, expected, type, url, bookedOffers, isExternal }) => {
        const offer = buildOffer({
          externalTicketOfficeUrl: url,
          category: { ...baseOffer.category, categoryType: type },
        })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: false,
          offer,
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
      type                  | url                     | bookedOffers                 | expected                      | disabled | isExternal
      ${CategoryType.Event} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Event} | ${'http://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${true}
      ${CategoryType.Thing} | ${undefined}            | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Thing} | ${'http://url-externe'} | ${{}}                        | ${"Accéder à l'offre"}        | ${false} | ${true}
      ${CategoryType.Thing} | ${undefined}            | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${true}
    `(
      'CTA(disabled=$disabled) = "$expected" for categoryType=$type and url=$url',
      ({ disabled, expected, type, url, bookedOffers, isExternal }) => {
        const offer = buildOffer({
          externalTicketOfficeUrl: url,
          category: { ...baseOffer.category, categoryType: type },
          isEducational: true,
        })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
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
      partialOffer: Partial<OfferAdaptedResponse>,
      parameters?: Partial<Parameters<typeof getCtaWordingAndAction>[0]>
    ) =>
      getCtaWordingAndAction({
        isLoggedIn: true,
        isBeneficiary: true,
        offer: buildOffer(partialOffer),
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
      type                  | hasEnoughCredit | expected                     | disabled
      ${CategoryType.Thing} | ${true}         | ${'Réserver'}                | ${false}
      ${CategoryType.Event} | ${true}         | ${'Voir les disponibilités'} | ${false}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $type => $expected - digital offers',
      ({ disabled, expected, hasEnoughCredit, type }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type }, isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      type                  | hasEnoughCredit | isDigital | expected                          | disabled
      ${CategoryType.Thing} | ${false}        | ${true}   | ${'Crédit numérique insuffisant'} | ${true}
      ${CategoryType.Thing} | ${true}         | ${true}   | ${'Réserver'}                     | ${false}
      ${CategoryType.Thing} | ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}
      ${CategoryType.Thing} | ${true}         | ${false}  | ${'Réserver'}                     | ${false}
    `(
      'check is credit is enough | $type x $isDigital => $expected',
      ({ disabled, expected, hasEnoughCredit, type, isDigital }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type }, isDigital },
          { hasEnoughCredit, isUnderageBeneficiary: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      type                  | hasEnoughCredit | expected                     | disabled
      ${CategoryType.Thing} | ${false}        | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${true}         | ${'Réserver'}                | ${false}
      ${CategoryType.Event} | ${false}        | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${true}         | ${'Voir les disponibilités'} | ${false}
    `(
      'check if Credit is enough for the category | $type | creditThing=$creditThing | creditEvent=$creditEvent => $expected',
      ({ disabled, expected, hasEnoughCredit, type }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type } },
          { hasEnoughCredit }
        )
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
          {
            isDigital: true,
            category: { ...baseOffer.category, categoryType: CategoryType.Thing },
          },
          { hasEnoughCredit, isUnderageBeneficiary: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // same as beneficiaries except for video games and non free digital offers except press category
    describe('underage beneficiary', () => {
      it.each`
        type                  | expected                     | disabled | isDigital | name                         | price
        ${CategoryType.Thing} | ${'Réserver'}                | ${false} | ${true}   | ${CategoryIdEnum.MEDIA}      | ${20}
        ${CategoryType.Event} | ${undefined}                 | ${true}  | ${true}   | ${CategoryIdEnum.FILM}       | ${20}
        ${CategoryType.Event} | ${'Voir les disponibilités'} | ${false} | ${true}   | ${CategoryIdEnum.FILM}       | ${0}
        ${CategoryType.Thing} | ${undefined}                 | ${true}  | ${false}  | ${CategoryIdEnum.JEUXVIDEO}  | ${0}
        ${CategoryType.Event} | ${'Voir les disponibilités'} | ${false} | ${false}  | ${CategoryIdEnum.INSTRUMENT} | ${20}
      `(
        'CTA(disabled=$disabled) = "$expected" for categoryType=$type, isDigital=$isDigital, categoryName=$name and price=$price',
        ({ type, expected, disabled, isDigital, name, price }) => {
          mockedUser.roles = [UserRole.UNDERAGEBENEFICIARY]
          const { result } = renderHook(useAvailableCategories)
          const { wording, onPress } = getCta(
            {
              category: { ...baseOffer.category, categoryType: type, name },
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
            { isUnderageBeneficiary: true, availableCategories: result.current }
          )
          expect(wording).toEqual(expected)
          expect(onPress === undefined).toBe(disabled)
        }
      )
    })
  })

  describe.skip('Navigation on success', () => {
    // TODO
  })

  describe('CTA - Analytics', () => {
    it('logs event ClickBookOffer when we click CTA "Réserver" (beneficiary user)', () => {
      const offer = buildOffer({
        externalTicketOfficeUrl: 'http://www.google.com',
        category: { ...baseOffer.category, categoryType: CategoryType.Thing },
      })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
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
      const offer = buildOffer({
        category: { ...baseOffer.category, categoryType: CategoryType.Event },
      })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
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

const buildOffer = (partialOffer: Partial<OfferAdaptedResponse>): OfferAdaptedResponse => ({
  ...baseOffer,
  ...partialOffer,
})
