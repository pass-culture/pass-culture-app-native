import mockdate from 'mockdate'

import { OfferResponse, YoungStatusType, SubscriptionStatus, SearchGroupNameEnumv2 } from 'api/gen'
import { OfferModal } from 'features/offer/enums'
import { offerResponseSnap as baseOffer } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

import { getCtaWordingAndAction } from './useCtaWordingAndAction'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getCtaWordingAndAction', () => {
  describe('logged out user', () => {
    it('should display "Réserver l’offre" wording and modal "authentication"', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: false,
        userStatus: { statusType: YoungStatusType.non_eligible },
        isBeneficiary: false,
        offer: buildOffer({}),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.AUTHENTICATION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })
  })

  describe('Non eligible', () => {
    it('should display "Réserver l’offre" disabled wording with bottom banner when no external url', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: true,
        userStatus: { statusType: YoungStatusType.non_eligible },
        isBeneficiary: false,
        offer: buildOffer({}),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        isDisabled: true,
        bottomBannerText:
          'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
        wording: 'Réserver l’offre',
      })
    })

    it('should display "Accéder au site partenaire" wording when external url', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: true,
        userStatus: { statusType: YoungStatusType.non_eligible },
        isBeneficiary: false,
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        externalNav: { url: 'https://url-externe' },
        isDisabled: false,
        wording: 'Accéder au site partenaire',
      })
    })
  })

  describe('Eligible but non Beneficiary yet', () => {
    it('should return finish subscription modal when user has not finished subscription', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: true,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
        },
        isBeneficiary: false,
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })

    it('should return application pending modal when user is waiting for his application to complete', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: true,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_subscription_pending,
        },
        isBeneficiary: false,
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.APPLICATION_PROCESSING,
        wording: 'Réserver l’offre',
        ...result,
      })
    })

    it('should return application error modal when user has an issue with his application', () => {
      const result = getCtaWordingAndAction({
        isLoggedIn: true,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_subscription_issues,
        },
        isBeneficiary: false,
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
        hasEnoughCredit: false,
        bookedOffers: {},
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.ERROR_APPLICATION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })
  })

  describe('Non Beneficiary', () => {
    it.each`
      isEvent  | url                      | bookedOffers                 | expected                        | disabled | modalToDisplay
      ${true}  | ${undefined}             | ${{}}                        | ${undefined}                    | ${true}  | ${undefined}
      ${true}  | ${'https://url-externe'} | ${{}}                        | ${'Accéder au site partenaire'} | ${false} | ${undefined}
      ${false} | ${undefined}             | ${{}}                        | ${undefined}                    | ${true}  | ${undefined}
      ${false} | ${'https://url-externe'} | ${{}}                        | ${'Accéder au site partenaire'} | ${false} | ${undefined}
      ${false} | ${undefined}             | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}        | ${false} | ${undefined}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, modalToDisplay }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: false,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress, navigateTo, externalNav } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(result?.externalNav?.url).toEqual(url)
        expect(result?.modalToDisplay).toEqual(modalToDisplay)
      }
    )
  })

  // same as non beneficiary use cases, beneficiary users should not be able to book educational offers
  describe('educational offer', () => {
    it.each`
      isEvent  | url                      | bookedOffers                 | expected                        | disabled | modalToDisplay
      ${true}  | ${undefined}             | ${{}}                        | ${undefined}                    | ${true}  | ${undefined}
      ${true}  | ${'https://url-externe'} | ${{}}                        | ${'Accéder au site partenaire'} | ${false} | ${undefined}
      ${false} | ${undefined}             | ${{}}                        | ${undefined}                    | ${true}  | ${undefined}
      ${false} | ${'https://url-externe'} | ${{}}                        | ${'Accéder au site partenaire'} | ${false} | ${undefined}
      ${false} | ${undefined}             | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}        | ${false} | ${undefined}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, modalToDisplay }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url, isEducational: true })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress, navigateTo, externalNav } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(result?.externalNav?.url).toEqual(url)
        expect(result?.modalToDisplay).toEqual(modalToDisplay)
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
        userStatus: { statusType: YoungStatusType.beneficiary },
        isBeneficiary: true,
        offer: buildOffer(partialOffer),
        subcategory: buildSubcategory(partialSubcategory || {}),
        hasEnoughCredit: true,
        bookedOffers: {},
        isUnderageBeneficiary: true,
        ...parameters,
      }) || { wording: '' }

    it('CTA="Offre épuisée" if offer is sold out', () => {
      const result = getCta({ isSoldOut: true })
      expect(result).toEqual({
        wording: 'Offre épuisée',
        isDisabled: true,
      })
    })

    it('CTA="Offre expirée" if offer is expired and sold out', () => {
      const result = getCta({ isExpired: true, isSoldOut: true })
      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })

    it('CTA="Offre expirée" if offer is expired', () => {
      const result = getCta({ isExpired: true })
      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })

    it('CTA="Offre expirée" if offer is not released', () => {
      const result = getCta({ isReleased: false })
      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })

    it('CTA="Réserver l’offre" if offer is an ended booking', () => {
      const result = getCta({}, { isEndedUsedBooking: true })
      expect(result).toEqual({
        wording: 'Réserver l’offre',
        modalToDisplay: OfferModal.BOOKING,
        isDisabled: false,
        ...result,
      })
    })

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | wording                      | isDisabled | modalToDisplay
      ${false} | ${true}         | ${'Réserver l’offre'}        | ${false}   | ${OfferModal.BOOKING}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false}   | ${OfferModal.BOOKING}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $isEvent => $wording - digital offers',
      ({ isDisabled, wording, hasEnoughCredit, isEvent, modalToDisplay }) => {
        const result = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent }
        )
        expect(result).toEqual({
          wording,
          modalToDisplay,
          isDisabled,
          ...result,
        })
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | isDigital | wording                           | isDisabled | isUnderageBeneficiary | modalToDisplay
      ${false}        | ${true}   | ${'Crédit numérique insuffisant'} | ${true}    | ${false}              | ${undefined}
      ${true}         | ${true}   | ${'Réserver l’offre'}             | ${false}   | ${false}              | ${OfferModal.BOOKING}
      ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}    | ${false}              | ${undefined}
      ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}    | ${true}               | ${undefined}
      ${true}         | ${false}  | ${'Réserver l’offre'}             | ${false}   | ${false}              | ${OfferModal.BOOKING}
    `(
      'check is credit is enough | non event x $isDigital => $wording',
      ({
        isDisabled,
        wording,
        hasEnoughCredit,
        isDigital,
        isUnderageBeneficiary,
        modalToDisplay,
      }) => {
        const result = getCta(
          { isDigital },
          { hasEnoughCredit, isUnderageBeneficiary },
          { isEvent: false }
        )
        expect(result).toEqual({
          wording,
          modalToDisplay,
          isDisabled,
          ...result,
        })
      }
    )

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | wording                      | isDisabled | modalToDisplay
      ${false} | ${false}        | ${'Crédit insuffisant'}      | ${true}    | ${undefined}
      ${false} | ${true}         | ${'Réserver l’offre'}        | ${false}   | ${OfferModal.BOOKING}
      ${true}  | ${false}        | ${'Crédit insuffisant'}      | ${true}    | ${undefined}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false}   | ${OfferModal.BOOKING}
    `(
      'check if Credit is enough for the category | $isEvent | creditThing=$creditThing | creditEvent=$creditEvent => $wording',
      ({ isDisabled, wording, hasEnoughCredit, isEvent, modalToDisplay }) => {
        const result = getCta({}, { hasEnoughCredit }, { isEvent })

        expect(result).toEqual({
          wording,
          modalToDisplay,
          isDisabled,
          ...result,
        })
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | wording                           | isDisabled | modalToDisplay
      ${false}        | ${'Crédit numérique insuffisant'} | ${true}    | ${undefined}
      ${true}         | ${'Réserver l’offre'}             | ${false}   | ${OfferModal.BOOKING}
    `(
      'check if Credit is enough for digital offers | creditThing=$creditThing => $wording',
      ({ isDisabled, wording, hasEnoughCredit, modalToDisplay }) => {
        const result = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent: false }
        )

        expect(result).toEqual({
          wording,
          modalToDisplay,
          isDisabled,
          ...result,
        })
      }
    )

    // same as beneficiaries except for video games and non free digital offers except press category
    describe('underage beneficiary', () => {
      it.each`
        isEvent  | expected                     | disabled | isDigital | category                                     | price | isForbiddenToUnderage | modalToDisplay
        ${false} | ${'Réserver l’offre'}        | ${false} | ${true}   | ${SearchGroupNameEnumv2.MEDIA_PRESSE}        | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA} | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA} | ${0}  | ${false}              | ${OfferModal.BOOKING}
        ${false} | ${'Réserver l’offre'}        | ${false} | ${false}  | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}    | ${0}  | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${false}  | ${SearchGroupNameEnumv2.INSTRUMENTS}         | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${undefined}                 | ${true}  | ${false}  | ${SearchGroupNameEnumv2.INSTRUMENTS}         | ${20} | ${true}               | ${undefined}
      `(
        'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent, isDigital=$isDigital, isForbiddenToUnderage=$isForbiddenToUnderage, category=$category and price=$price',
        ({
          isEvent,
          expected,
          disabled,
          isDigital,
          category,
          price,
          isForbiddenToUnderage,
          modalToDisplay: mustShowBookingModal,
        }) => {
          const { wording, onPress, navigateTo, externalNav, modalToDisplay } = getCta(
            {
              isDigital,
              isForbiddenToUnderage,
              stocks: [
                {
                  id: 118929,
                  beginningDatetime: '2021-01-04T13:30:00',
                  isBookable: true,
                  isExpired: false,
                  isSoldOut: false,
                  isForbiddenToUnderage,
                  price,
                  features: [],
                },
              ],
            },
            { isUnderageBeneficiary: true },
            { isEvent, searchGroupName: category }
          )
          expect(wording).toEqual(expected)
          expect(modalToDisplay).toEqual(mustShowBookingModal)
          expect(
            onPress === undefined && navigateTo === undefined && externalNav === undefined
          ).toBe(disabled)
        }
      )
    })
  })

  describe('CTA - Analytics', () => {
    it('logs event ClickBookOffer when we click CTA "Réserver l’offre" (beneficiary user)', () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'https://www.google.com' })
      const subcategory = buildSubcategory({ isEvent: false })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      if (onPress) onPress()
      expect(analytics.logClickBookOffer).toHaveBeenNthCalledWith(1, baseOffer.id)
    })

    it('logs event ConsultAvailableDates when we click CTA "Voir les disponibilités" (beneficiary user)', () => {
      const offer = buildOffer({})
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      if (onPress) onPress()
      expect(analytics.logConsultAvailableDates).toHaveBeenNthCalledWith(1, baseOffer.id)
    })

    it('logs event ConsultFinishSubscriptionModal when we click CTA "Réserver l’offre" with has_to_complete_subscription status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
          },
          isBeneficiary: false,
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
          hasEnoughCredit: false,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      if (onPress) onPress()
      expect(analytics.logConsultFinishSubscriptionModal).toHaveBeenNthCalledWith(1, baseOffer.id)
    })

    it('logs event ConsultApplicationProcessingModal when we click CTA "Réserver l’offre" with has_subscription_pending status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_pending,
          },
          isBeneficiary: false,
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
          hasEnoughCredit: false,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      if (onPress) onPress()
      expect(analytics.logConsultApplicationProcessingModal).toHaveBeenNthCalledWith(
        1,
        baseOffer.id
      )
    })

    it('logs event ConsultErrorApplicationModal when we click CTA "Réserver l’offre" with has_subscription_issues status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_issues,
          },
          isBeneficiary: false,
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
          hasEnoughCredit: false,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      if (onPress) onPress()
      expect(analytics.logConsultErrorApplicationModal).toHaveBeenNthCalledWith(1, baseOffer.id)
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
