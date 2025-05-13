import mockdate from 'mockdate'

import {
  EligibilityType,
  OfferResponseV2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
  SubscriptionStatus,
  YoungStatusType,
} from 'api/gen'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { PlaylistType } from 'features/offer/enums'
import { offerResponseSnap as baseOffer } from 'features/offer/fixtures/offerResponse'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Subcategory } from 'libs/subcategories/types'
import { OfferModal } from 'shared/offer/enums'
import { mockBuilder } from 'tests/mockBuilder'

import { getCtaWordingAndAction } from './useCtaWordingAndAction'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

const CineScreeningOffer = {
  ...baseOffer,
  subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
}

const defaultParameters = {
  isLoggedIn: true,
  user: { ...nonBeneficiaryUser, bookedOffer: {} },
  userStatus: { statusType: YoungStatusType.non_eligible },
  isBeneficiary: false,
  hasEnoughCredit: false,
  isUnderageBeneficiary: false,
  bookOffer: jest.fn(),
  isBookingLoading: false,
  booking: undefined,
  isDepositExpired: false,
  featureFlags: { enableBookingFreeOfferFifteenSixteen: true },
}

jest.mock('libs/firebase/analytics/analytics')

const setFreeOfferIdSpy = jest.spyOn(freeOfferIdActions, 'setFreeOfferId')

describe('getCtaWordingAndAction', () => {
  describe('Logged out user', () => {
    it('should display "Réserver l’offre" wording and modal "authentication"', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        isLoggedIn: false,
        user: undefined,
        offer: buildOffer({}),
        subcategory: buildSubcategory({}),
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.AUTHENTICATION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })
  })

  describe('Free offer', () => {
    it('should display "Réserver l’offre" wording with navigate to SetName screen and params type', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        user: { ...nonBeneficiaryUser, eligibility: EligibilityType.free },
        offer: buildOffer({ stocks: [{ ...baseOffer.stocks[0], price: 0 }] }),
        subcategory: buildSubcategory({}),
        featureFlags: { enableBookingFreeOfferFifteenSixteen: true },
      })

      expect(result).toEqual({
        isDisabled: false,
        wording: 'Réserver l’offre',
        navigateTo: { screen: 'SetName', params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } },
      })
      expect(setFreeOfferIdSpy).toHaveBeenCalledTimes(1)
    })

    it('should display "Réserver l’offre" wording and open booking modal when user profile complete', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        user: { ...beneficiaryUser, eligibility: EligibilityType.free },
        offer: buildOffer({ stocks: [{ ...baseOffer.stocks[0], price: 0 }] }),
        subcategory: buildSubcategory({}),
        featureFlags: { enableBookingFreeOfferFifteenSixteen: true },
      })

      expect(result).toEqual({
        isDisabled: false,
        wording: 'Réserver l’offre',
        modalToDisplay: OfferModal.BOOKING,
      })
    })

    it('should disable CTA with bottom banner when profile is incomplete and offer is not free', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        user: { ...nonBeneficiaryUser, eligibility: EligibilityType.free },
        offer: buildOffer({ stocks: [{ ...baseOffer.stocks[0], price: 2000 }] }),
        subcategory: buildSubcategory({}),
        featureFlags: { enableBookingFreeOfferFifteenSixteen: true },
      })

      expect(result).toEqual({
        isDisabled: true,
        wording: 'Réserver l’offre',
        bottomBannerText:
          'Tu peux uniquement réserver des offres gratuites entre tes 15 et 16 ans.',
      })
    })

    it('should disable CTA with "Crédit insuffisant" wording when profile is complete and offer is not free', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        user: { ...beneficiaryUser, eligibility: EligibilityType.free },
        offer: buildOffer({ stocks: [{ ...baseOffer.stocks[0], price: 2000 }] }),
        subcategory: buildSubcategory({}),
        featureFlags: { enableBookingFreeOfferFifteenSixteen: true },
      })

      expect(result).toEqual({
        isDisabled: true,
        wording: 'Crédit insuffisant',
      })
    })
  })

  describe('Non eligible user', () => {
    it('should display "Réserver l’offre" disabled wording with bottom banner when no external url', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        offer: buildOffer({}),
        subcategory: buildSubcategory({}),
      })

      expect(result).toEqual({
        isDisabled: true,
        bottomBannerText:
          'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
        movieScreeningUserData: {
          isUserEligible: false,
        },
        wording: 'Réserver l’offre',
      })
    })

    it('should display "Accéder au site partenaire" wording when external url', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
      })

      expect(result).toEqual({
        externalNav: { url: 'https://url-externe' },
        isDisabled: false,
        wording: 'Accéder au site partenaire',
      })
    })

    it('should display "Accéder au site partenaire" wording when external url and offer is digital and free', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        offer: buildOffer({
          externalTicketOfficeUrl: 'https://url-externe',
          isDigital: true,
          stocks: [{ ...baseOffer.stocks[0], price: 0 }],
        }),
        subcategory: buildSubcategory({}),
      })

      expect(result).toEqual({
        externalNav: { url: 'https://url-externe' },
        isDisabled: false,
        wording: 'Accéder au site partenaire',
      })
    })
  })

  describe('Eligible but non Beneficiary yet user', () => {
    it('should return finish subscription modal when user has not finished subscription', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
        },
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
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
        ...defaultParameters,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_subscription_pending,
        },
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
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
        ...defaultParameters,
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_subscription_issues,
        },
        offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
        subcategory: buildSubcategory({}),
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.ERROR_APPLICATION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })
  })

  describe('Non Beneficiary user', () => {
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
          ...defaultParameters,
          user: { ...beneficiaryUser, bookedOffers },
          userStatus: { statusType: YoungStatusType.ex_beneficiary },
          offer,
          subcategory,
          hasEnoughCredit: true,
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
  describe('Educational offer', () => {
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
          ...defaultParameters,
          user: { ...beneficiaryUser, bookedOffers },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
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

  describe('Beneficiary user', () => {
    const getCta = (
      partialOffer: Partial<OfferResponseV2>,
      parameters?: Partial<Parameters<typeof getCtaWordingAndAction>[0]>,
      partialSubcategory?: Partial<Subcategory>
    ) =>
      getCtaWordingAndAction({
        ...defaultParameters,
        user: { ...beneficiaryUser },
        userStatus: { statusType: YoungStatusType.beneficiary },
        isBeneficiary: true,
        offer: buildOffer({ ...partialOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER }),
        subcategory: buildSubcategory(partialSubcategory || {}),
        hasEnoughCredit: true,
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

    it('CTA="Accéder à l’offre en ligne" when offer is digital and free', () => {
      const result = getCta({ isDigital: true, stocks: [{ ...baseOffer.stocks[0], price: 0 }] })

      expect(result).toEqual({
        wording: 'Accéder à l’offre en ligne',
        isDisabled: false,
        ...result,
      })
    })

    it('CTA="Réserver l’offre" when offer is a free digital event', () => {
      const result = getCta(
        { isDigital: true, stocks: [{ ...baseOffer.stocks[0], price: 0 }] },
        {},
        { isEvent: true }
      )

      expect(result).toEqual({
        wording: 'Réserver l’offre',
        isDisabled: false,
        ...result,
      })
    })

    it('CTA="Réserver l’offre" when offer is digital and not free', () => {
      const result = getCta({ isDigital: true, stocks: [{ ...baseOffer.stocks[0], price: 100 }] })

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
      'check if credit is enough | non event x $isDigital => $wording',
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
    describe('Underage beneficiary user', () => {
      it.each`
        isEvent  | expected                     | disabled | isDigital | category                                  | price | isForbiddenToUnderage | modalToDisplay
        ${false} | ${'Réserver l’offre'}        | ${false} | ${true}   | ${SearchGroupNameEnumv2.MEDIA_PRESSE}     | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnumv2.CINEMA}           | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Réserver l’offre'}        | ${false} | ${true}   | ${SearchGroupNameEnumv2.CINEMA}           | ${0}  | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnumv2.CINEMA}           | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${false} | ${'Réserver l’offre'}        | ${false} | ${false}  | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS} | ${0}  | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${false}  | ${SearchGroupNameEnumv2.MUSIQUE}          | ${20} | ${false}              | ${OfferModal.BOOKING}
        ${true}  | ${undefined}                 | ${true}  | ${false}  | ${SearchGroupNameEnumv2.MUSIQUE}          | ${20} | ${true}               | ${undefined}
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
    const defaultApiRecoParams = {
      call_id: '1',
      reco_origin: 'unknown',
      model_origin: 'default',
    }

    const defaultPlaylistType = PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS

    it('logs event ClickBookOffer when we click CTA "Réserver l’offre" (beneficiary user)', () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'https://www.google.com' })
      const subcategory = buildSubcategory({ isEvent: false })

      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...beneficiaryUser },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          apiRecoParams: defaultApiRecoParams,
          playlistType: defaultPlaylistType,
        }) || {}

      onPress?.()

      expect(analytics.logClickBookOffer).toHaveBeenNthCalledWith(1, {
        offerId: baseOffer.id,
        ...defaultApiRecoParams,
        playlistType: defaultPlaylistType,
      })
    })

    it('logs event ClickBookOffer when we click CTA "Réserver l’offre" on free digital event not already booked', () => {
      const offer = buildOffer({
        isDigital: true,
        stocks: [
          {
            id: 118929,
            beginningDatetime: '2021-01-04T13:30:00',
            price: 0,
            isBookable: true,
            isExpired: false,
            isForbiddenToUnderage: false,
            isSoldOut: false,
            features: [],
          },
          {
            id: 118928,
            beginningDatetime: '2021-01-03T18:00:00',
            price: 0,
            isBookable: true,
            isExpired: false,
            isForbiddenToUnderage: false,
            isSoldOut: false,
            features: [],
          },
        ],
      })
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          isLoggedIn: true,
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          isUnderageBeneficiary: false,
          bookOffer: jest.fn(),
          isBookingLoading: false,
          booking: undefined,
          apiRecoParams: defaultApiRecoParams,
          playlistType: defaultPlaylistType,
        }) || {}

      onPress?.()

      expect(analytics.logClickBookOffer).toHaveBeenNthCalledWith(1, {
        offerId: baseOffer.id,
        ...defaultApiRecoParams,
        playlistType: defaultPlaylistType,
      })
    })

    it('logs event logViewedBookingPage when we click CTA "Réserver l’offre" on free digital event already booked', () => {
      const offer = baseOffer
      const subcategory = buildSubcategory({ isEvent: true })
      const booking = mockBuilder.bookingResponse({ id: offer.id })

      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...beneficiaryUser, bookedOffers: { [offer.id]: offer.id } },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          booking,
          apiRecoParams: defaultApiRecoParams,
          playlistType: defaultPlaylistType,
        }) || {}

      onPress?.()

      expect(analytics.logViewedBookingPage).toHaveBeenNthCalledWith(1, {
        from: 'offer',
        offerId: offer.id,
      })
    })

    it('logs event ClickBookOffer when CTA "Voir les disponibilités" is clicked', () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'https://www.google.com' })
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          isLoggedIn: true,
          user: { ...beneficiaryUser },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          apiRecoParams: defaultApiRecoParams,
          playlistType: defaultPlaylistType,
        }) || {}

      onPress?.()

      expect(analytics.logClickBookOffer).toHaveBeenNthCalledWith(1, {
        offerId: baseOffer.id,
        ...defaultApiRecoParams,
        playlistType: defaultPlaylistType,
      })
    })

    it('logs event ConsultAvailableDates when we click CTA "Voir les disponibilités" (beneficiary user)', () => {
      const offer = buildOffer({})
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...beneficiaryUser },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          isBookingLoading: false,
        }) || {}

      onPress?.()

      expect(analytics.logConsultAvailableDates).toHaveBeenNthCalledWith(1, baseOffer.id)
    })

    it('logs event ConsultFinishSubscriptionModal when we click CTA "Réserver l’offre" with has_to_complete_subscription status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...nonBeneficiaryUser },
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
          },
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
        }) || {}

      onPress?.()

      expect(analytics.logConsultFinishSubscriptionModal).toHaveBeenNthCalledWith(1, baseOffer.id)
    })

    it('logs event ConsultApplicationProcessingModal when we click CTA "Réserver l’offre" with has_subscription_pending status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...nonBeneficiaryUser },
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_pending,
          },
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
        }) || {}

      onPress?.()

      expect(analytics.logConsultApplicationProcessingModal).toHaveBeenNthCalledWith(
        1,
        baseOffer.id
      )
    })

    it('logs event ConsultErrorApplicationModal when we click CTA "Réserver l’offre" with has_subscription_issues status', () => {
      const { onPress } =
        getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...nonBeneficiaryUser },
          userStatus: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_issues,
          },
          offer: buildOffer({ externalTicketOfficeUrl: 'https://url-externe' }),
          subcategory: buildSubcategory({}),
        }) || {}

      onPress?.()

      expect(analytics.logConsultErrorApplicationModal).toHaveBeenNthCalledWith(1, baseOffer.id)
    })
  })

  describe('CTA - XP cine on Offer page', () => {
    it('should return bottomBannerText and no wording if user is not eligible', async () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        offer: CineScreeningOffer,
        subcategory: buildSubcategory({ isEvent: true }),
      })

      expect(result).toEqual({
        bottomBannerText:
          'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
        wording: undefined,
        isDisabled: true,
        movieScreeningUserData: {
          isUserEligible: false,
        },
      })
    })

    it('should return bottomBannerText and no wording if user has expired credit', async () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        userStatus: { statusType: YoungStatusType.beneficiary },
        isBeneficiary: true,
        offer: CineScreeningOffer,
        subcategory: buildSubcategory({ isEvent: true }),
        isDepositExpired: true,
      })

      expect(result).toEqual({
        bottomBannerText: 'Tu ne peux pas réserver cette offre car ton crédit a expiré.',
        wording: undefined,
        movieScreeningUserData: {
          isUserCreditExpired: true,
        },
      })
    })

    it('should return bottomBannerText and no wording if user has not enough credit', async () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        userStatus: { statusType: YoungStatusType.beneficiary },
        isBeneficiary: true,
        offer: CineScreeningOffer,
        subcategory: buildSubcategory({ isEvent: true }),
        hasEnoughCredit: false,
      })

      expect(result).toEqual({
        bottomBannerText: 'Tu ne peux pas réserver cette offre car ton crédit est insuffisant.',
        movieScreeningUserData: {
          hasEnoughCredit: false,
          isUserLoggedIn: true,
        },
        wording: undefined,
        isDisabled: true,
      })
    })

    it.each<{ isEvent: boolean }>([{ isEvent: true }, { isEvent: false }])(
      'should return bottomBannerText and wording if user has already booked this offer',
      async (isOfferEvent) => {
        const result = getCtaWordingAndAction({
          ...defaultParameters,
          user: { ...beneficiaryUser, bookedOffers: { [baseOffer.id]: 116656 } },
          userStatus: { statusType: YoungStatusType.beneficiary },
          isBeneficiary: true,
          offer: CineScreeningOffer,
          subcategory: buildSubcategory(isOfferEvent),
          hasEnoughCredit: true,
        })

        expect(JSON.stringify(result)).toEqual(
          JSON.stringify({
            wording: 'Voir ma réservation',
            isDisabled: false,
            navigateTo: {
              screen: 'BookingDetails',
              params: {
                id: 116656,
              },
              fromRef: true,
            },
            onPress: () => {
              analytics.logViewedBookingPage({ offerId: CineScreeningOffer.id, from: 'offer' })
            },
            bottomBannerText: 'Tu ne peux réserver ce film qu’une seule fois.',
            movieScreeningUserData: {
              bookings: undefined,
              hasBookedOffer: true,
            },
          })
        )
      }
    )

    it('should display "Réserver l’offre" wording and modal "authentication" if user is not logged in', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        isLoggedIn: false,
        user: undefined,
        userStatus: { statusType: YoungStatusType.non_eligible },
        offer: buildOffer({}),
        subcategory: buildSubcategory({ isEvent: true }),
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.AUTHENTICATION,
        wording: 'Réserver l’offre',
        ...result,
      })
    })

    it('should return application pending modal when user is waiting for his application to complete', () => {
      const result = getCtaWordingAndAction({
        ...defaultParameters,
        isLoggedIn: true,
        user: { ...nonBeneficiaryUser },
        userStatus: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_subscription_pending,
        },
        offer: CineScreeningOffer,
        subcategory: buildSubcategory({ isEvent: true }),
      })

      expect(result).toEqual({
        isDisabled: false,
        modalToDisplay: OfferModal.APPLICATION_PROCESSING,
        wording: 'Réserver l’offre',
        ...result,
      })
    })
  })
})

const buildOffer = (partialOffer: Partial<OfferResponseV2>): OfferResponseV2 => ({
  ...baseOffer,
  ...partialOffer,
})

const baseSubcategory = subcategoriesDataTest.subcategories[0]
const buildSubcategory = (partialSubcategory: Partial<Subcategory>): Subcategory =>
  ({
    ...baseSubcategory,
    ...partialSubcategory,
  }) as Subcategory
