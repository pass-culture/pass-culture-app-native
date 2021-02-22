import mockdate from 'mockdate'

import { CategoryType } from 'api/gen'
import { offerAdaptedResponseSnap as baseOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'

import { getCtaWordingAndAction, isOfferExpired, isOfferSoldOut } from '../useCtaWordingAndAction'
import {
  expiredOffer,
  notExpiredOffer,
  notExpiredOfferNoLimitDate,
  soldOutOffer,
  notSoldOutOffer,
  soldOutStock,
  expiredStock1,
  expiredStock2,
} from '../useCtaWordingAndAction.testsFixtures'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getCtaWordingAndAction', () => {
  describe('Non Beneficiary', () => {
    it.each`
      type                  | url                     | expected                      | disabled | isExternal
      ${CategoryType.Event} | ${undefined}            | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Event} | ${'http://url-externe'} | ${'Accéder à la billetterie'} | ${false} | ${true}
      ${CategoryType.Thing} | ${undefined}            | ${undefined}                  | ${true}  | ${undefined}
      ${CategoryType.Thing} | ${'http://url-externe'} | ${"Accéder à l'offre"}        | ${false} | ${false}
    `(
      'CTA(disabled=$disabled) = "$expected" for categoryType=$type and url=$url',
      ({ disabled, expected, type, url, isExternal }) => {
        const offer = buildOffer({
          externalTicketOfficeUrl: url,
          category: { ...baseOffer.category, categoryType: type },
        })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: false,
          offer,
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
        ...parameters,
      }) || { wording: '' }

    it('CTA="Offre expirée" if offer is inactive', () => {
      const { wording, onPress } = getCta({ isActive: false })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
    })

    it('CTA="Offre épuisée" if offer is sold out', () => {
      const { wording, onPress } = getCta({ stocks: [soldOutStock] })
      expect(wording).toEqual('Offre épuisée')
      expect(onPress === undefined).toBeTruthy()
    })
    it('CTA="Offre expirée" if offer is expired', () => {
      const { wording, onPress } = getCta({ stocks: [expiredStock1, expiredStock2] })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
    })

    // offer price is 5
    it.each`
      type                  | creditThing  | creditEvent  | expected                     | disabled
      ${CategoryType.Thing} | ${2000}      | ${undefined} | ${'Réserver'}                | ${false}
      ${CategoryType.Thing} | ${2000}      | ${undefined} | ${'Réserver'}                | ${false}
      ${CategoryType.Event} | ${undefined} | ${2000}      | ${'Voir les disponibilités'} | ${false}
      ${CategoryType.Event} | ${undefined} | ${2000}      | ${'Voir les disponibilités'} | ${false}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $type => $expected - digital offers',
      ({ creditEvent, creditThing, disabled, expected, type }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type }, isDigital: true },
          { creditEvent, creditThing }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      type                  | creditThing | creditEvent  | isDigital | expected                          | disabled
      ${CategoryType.Thing} | ${200}      | ${undefined} | ${true}   | ${'Crédit numérique insuffisant'} | ${true}
      ${CategoryType.Thing} | ${2000}     | ${undefined} | ${true}   | ${'Réserver'}                     | ${false}
      ${CategoryType.Thing} | ${200}      | ${undefined} | ${false}  | ${'Crédit insuffisant'}           | ${true}
      ${CategoryType.Thing} | ${2000}     | ${undefined} | ${false}  | ${'Réserver'}                     | ${false}
    `(
      'check is credit is enough | $type x $isDigital => $expected',
      ({ creditEvent, creditThing, disabled, expected, type, isDigital }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type }, isDigital },
          { creditEvent, creditThing }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      type                  | creditThing  | creditEvent  | expected                     | disabled
      ${CategoryType.Thing} | ${100}       | ${undefined} | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${100}       | ${2000}      | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${490}       | ${undefined} | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${510}       | ${undefined} | ${'Réserver'}                | ${false}
      ${CategoryType.Event} | ${undefined} | ${100}       | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${2000}      | ${100}       | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${undefined} | ${490}       | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${undefined} | ${600}       | ${'Voir les disponibilités'} | ${false}
    `(
      'check if Credit is enough for the category | $type | creditThing=$creditThing | creditEvent=$creditEvent => $expected',
      ({ creditEvent, creditThing, disabled, expected, type }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type } },
          { creditEvent, creditThing }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      creditThing | expected                          | disabled
      ${100}      | ${'Crédit numérique insuffisant'} | ${true}
      ${100}      | ${'Crédit numérique insuffisant'} | ${true}
      ${490}      | ${'Crédit numérique insuffisant'} | ${true}
      ${510}      | ${'Réserver'}                     | ${false}
    `(
      'check if Credit is enough for digital offers | creditThing=$creditThing => $expected',
      ({ creditThing, disabled, expected }) => {
        const { wording, onPress } = getCta(
          {
            isDigital: true,
            category: { ...baseOffer.category, categoryType: CategoryType.Thing },
          },
          { creditThing }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )
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
        }) || {}

      expect(analytics.logConsultAvailableDates).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) onPress()
      expect(analytics.logConsultAvailableDates).toBeCalledTimes(1)
      expect(analytics.logConsultAvailableDates).toBeCalledWith(baseOffer.id)
    })
  })
})

describe('isOfferExpired', () => {
  it.each`
    offer                         | isExpired
    ${expiredOffer}               | ${true}
    ${notExpiredOffer}            | ${false}
    ${notExpiredOfferNoLimitDate} | ${false}
  `('should check offer expiration correctly', ({ offer, isExpired }) => {
    expect(isOfferExpired(offer)).toBe(isExpired)
  })
})

describe('isOfferSoldOut', () => {
  it.each`
    offer              | isSoldOut
    ${soldOutOffer}    | ${true}
    ${notSoldOutOffer} | ${false}
  `('should check if offer is sold out correctly', ({ offer, isSoldOut }) => {
    expect(isOfferSoldOut(offer)).toEqual(isSoldOut)
  })
})

const buildOffer = (partialOffer: Partial<OfferAdaptedResponse>): OfferAdaptedResponse => ({
  ...baseOffer,
  ...partialOffer,
})
