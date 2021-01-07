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
      type                  | url                     | expected                              | disabled
      ${CategoryType.Event} | ${undefined}            | ${"Accéder à l'offre"}                | ${true}
      ${CategoryType.Event} | ${'http://url-externe'} | ${"Accéder à l'offre"}                | ${false}
      ${CategoryType.Thing} | ${undefined}            | ${'Accéder à la billetterie externe'} | ${true}
      ${CategoryType.Thing} | ${'http://url-externe'} | ${'Accéder à la billetterie externe'} | ${false}
    `(
      'CTA(disabled=$disabled) = "$expected" for categoryType=$type and url=$url',
      ({ disabled, expected, type, url }) => {
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
      type                  | creditThing  | creditEvent  | platform     | expected                     | disabled
      ${CategoryType.Thing} | ${2}         | ${undefined} | ${'ios'}     | ${'Impossible de réserver'}  | ${true}
      ${CategoryType.Thing} | ${20}        | ${undefined} | ${'ios'}     | ${'Impossible de réserver'}  | ${true}
      ${CategoryType.Event} | ${undefined} | ${20}        | ${'ios'}     | ${'Voir les disponibilités'} | ${false}
      ${CategoryType.Thing} | ${20}        | ${undefined} | ${'android'} | ${'Voir les disponibilités'} | ${false}
      ${CategoryType.Event} | ${undefined} | ${20}        | ${'android'} | ${'Voir les disponibilités'} | ${false}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $type x $platform => $expected',
      ({ creditEvent, creditThing, disabled, expected, type, platform }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type } },
          { creditEvent, creditThing, platform }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined).toBe(disabled)
      }
    )

    // offer price is 5
    it.each`
      type                  | creditThing  | creditEvent  | expected                     | disabled
      ${CategoryType.Thing} | ${1}         | ${undefined} | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${1}         | ${20}        | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${4.9}       | ${undefined} | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Thing} | ${5.1}       | ${undefined} | ${'Voir les disponibilités'} | ${false}
      ${CategoryType.Event} | ${undefined} | ${1}         | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${20}        | ${1}         | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${undefined} | ${4.9}       | ${'Crédit insuffisant'}      | ${true}
      ${CategoryType.Event} | ${undefined} | ${6}         | ${'Voir les disponibilités'} | ${false}
    `(
      'check if Credit is enough for the category | $type | creditThing=$creditThing | creditEvent=$creditEvent => $expected',
      ({ creditEvent, creditThing, disabled, expected, type }) => {
        const { wording, onPress } = getCta(
          { category: { ...baseOffer.category, categoryType: type } },
          { creditEvent, creditThing, platform: 'android' }
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
    it('logs event ClickBookOffer when we click CTA (non beneficiary user)', async () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'http://www.google.com' })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: false,
          offer,
        }) || {}

      expect(analytics.logClickBookOffer).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) await onPress()
      expect(analytics.logClickBookOffer).toBeCalledTimes(1)
      expect(analytics.logClickBookOffer).toBeCalledWith(baseOffer.id)
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
