import mockdate from 'mockdate'

import { CategoryType } from 'api/gen'
import { offerAdaptedResponseSnap as baseOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'

import { getCtaWordingAndAction } from '../useCtaWordingAndAction'

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
          hasEnoughCredit: true,
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
        ...parameters,
      }) || { wording: '' }

    it('CTA="Offre épuisée" if offer is sold out', () => {
      const { wording, onPress } = getCta({ isSoldOut: true })
      expect(wording).toEqual('Offre épuisée')
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
          { hasEnoughCredit }
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
          { hasEnoughCredit }
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
          { hasEnoughCredit }
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
          hasEnoughCredit: true,
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
