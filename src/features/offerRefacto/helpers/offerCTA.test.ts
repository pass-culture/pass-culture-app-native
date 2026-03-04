import mockdate from 'mockdate'

import {
  ActivityIdEnum,
  EligibilityType,
  SubcategoryIdEnum,
  SubscriptionStatus,
  YoungStatusType,
} from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { DEFAULT_CTA_WORDING } from 'features/offerRefacto/constants'
import { CTAContextFixture } from 'features/offerRefacto/fixtures/CTAContext.fixture'
import {
  getBaseProps,
  getCTAProps,
  getCTAWordingAndAction,
  getInsufficientCreditWording,
  getSpecificsMovieScreeningOffer,
  getSubscriptionCTAProps,
} from 'features/offerRefacto/helpers'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { OfferModal } from 'shared/offer/enums'

jest.mock('libs/firebase/analytics/analytics')
const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getBaseProps', () => {
  it('should return base props for not movie screening offer', () => {
    const result = getBaseProps(false)

    expect(result).toEqual({
      wording: DEFAULT_CTA_WORDING,
      isDisabled: false,
    })
  })

  it('should return base props for movie screening offer', () => {
    const result = getBaseProps(true)

    expect(result).toEqual({
      wording: undefined,
      isDisabled: false,
    })
  })
})

describe('getInsufficientCreditWording', () => {
  it('should return "Crédit numérique insuffisant" for a digital offer and a classic beneficiary', () => {
    const result = getInsufficientCreditWording(true, false)

    expect(result).toBe('Crédit numérique insuffisant')
  })

  it('should return "Crédit insuffisant" for a digital offer and an underage beneficiary', () => {
    const result = getInsufficientCreditWording(true, true)

    expect(result).toBe('Crédit insuffisant')
  })

  it('should return "Crédit insuffisant" for a physical offer and a classic beneficiary', () => {
    const result = getInsufficientCreditWording(false, false)

    expect(result).toBe('Crédit insuffisant')
  })

  it('should return "Crédit insuffisant" for a physical offer and an underage beneficiary', () => {
    const result = getInsufficientCreditWording(false, true)

    expect(result).toBe('Crédit insuffisant')
  })
})

describe('getSpecificsMovieScreeningOffer', () => {
  describe('BOOK_EVENT_OFFER type', () => {
    it('should return undefined wording for movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'BOOK_EVENT_OFFER',
        isMovieScreeningOffer: true,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ wording: undefined })
    })

    it('should return "Voir les disponibilités" as wording for not movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'BOOK_EVENT_OFFER',
        isMovieScreeningOffer: false,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ wording: 'Voir les disponibilités' })
    })
  })

  describe('ENDED_USED_BOOKING type', () => {
    it('should return already book bottom banner text for movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'ENDED_USED_BOOKING',
        isMovieScreeningOffer: true,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ bottomBannerText: BottomBannerTextEnum.ALREADY_BOOKED })
    })
  })

  describe('INSUFFICIENT_CREDIT type', () => {
    it('should return undefined wording, not enough credit bottom banner text and movie screening user data for movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'INSUFFICIENT_CREDIT',
        isMovieScreeningOffer: true,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({
        wording: undefined,
        bottomBannerText: BottomBannerTextEnum.NOT_ENOUGH_CREDIT,
        movieScreeningUserData: { isUserLoggedIn: true, hasEnoughCredit: false },
      })
    })

    it('should return insufficient credit wording and has enough credit message in bottom banner text for not movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'INSUFFICIENT_CREDIT',
        isMovieScreeningOffer: false,
        isDigital: false,
        isUnderageBeneficiary: false,
        hasEnoughCreditMessage: 'Ton crédit est insuffisant pour réserver cette offre.',
      })

      expect(result).toEqual({
        wording: 'Crédit insuffisant',
        bottomBannerText: 'Ton crédit est insuffisant pour réserver cette offre.',
      })
    })
  })

  describe('SEE_BOOKING type', () => {
    it('should return already book bottom banner text for movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'SEE_BOOKING',
        isMovieScreeningOffer: true,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ bottomBannerText: BottomBannerTextEnum.ALREADY_BOOKED })
    })
  })

  describe('SOLD_OUT_OFFER type', () => {
    it('should return undefined wording for movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'SOLD_OUT_OFFER',
        isMovieScreeningOffer: true,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ wording: undefined })
    })

    it('should return "Offre épuisée" as wording for not movie screening offer', () => {
      const result = getSpecificsMovieScreeningOffer({
        type: 'SOLD_OUT_OFFER',
        isMovieScreeningOffer: false,
        isDigital: false,
        isUnderageBeneficiary: false,
      })

      expect(result).toEqual({ wording: 'Offre épuisée' })
    })
  })
})

describe('getSubscriptionCTAProps', () => {
  it('should return empty props if no subscription status', () => {
    const result = getSubscriptionCTAProps(1)

    expect(result).toEqual({})
  })

  describe('has_to_complete_subscription subscription status', () => {
    it('should return finish subscription modal and movie screening user data', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_to_complete_subscription)

      expect(result.modalToDisplay).toEqual(OfferModal.FINISH_SUBSCRIPTION)
      expect(result.movieScreeningUserData).toEqual({ hasNotCompletedSubscriptionYet: true })
    })

    it('should trigger logConsultFinishSubscriptionModal log at pressing', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_to_complete_subscription)

      result.onPress && result.onPress()

      expect(analytics.logConsultFinishSubscriptionModal).toHaveBeenCalledWith(1)
    })
  })

  describe('has_subscription_pending subscription status', () => {
    it('should return application processing modal and movie screening user data', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_subscription_pending)

      expect(result.modalToDisplay).toEqual(OfferModal.APPLICATION_PROCESSING)
      expect(result.movieScreeningUserData).toEqual({ hasNotCompletedSubscriptionYet: true })
    })

    it('should trigger logConsultApplicationProcessingModal log at pressing', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_subscription_pending)

      result.onPress && result.onPress()

      expect(analytics.logConsultApplicationProcessingModal).toHaveBeenCalledWith(1)
    })
  })

  describe('has_subscription_issues subscription status', () => {
    it('should return error application modal and movie screening user data', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_subscription_issues)

      expect(result.modalToDisplay).toEqual(OfferModal.ERROR_APPLICATION)
      expect(result.movieScreeningUserData).toEqual({ hasNotCompletedSubscriptionYet: true })
    })

    it('should trigger logConsultErrorApplicationModal log at pressing', () => {
      const result = getSubscriptionCTAProps(1, SubscriptionStatus.has_subscription_issues)

      result.onPress && result.onPress()

      expect(analytics.logConsultErrorApplicationModal).toHaveBeenCalledWith(1)
    })
  })
})

describe('getCTAProps', () => {
  describe('Authentication CTA', () => {
    it('should trigger logConsultAuthenticationModal log at pressing', () => {
      const result = getCTAProps('AUTHENTICATION', CTAContextFixture)

      result?.onPress && result.onPress()

      expect(analytics.logConsultAuthenticationModal).toHaveBeenCalledWith(offerResponseSnap.id)
    })
  })

  describe('Book event offer CTA', () => {
    it('should trigger logConsultAvailableDates and logClickBookOffer logs at pressing', () => {
      const result = getCTAProps('BOOK_EVENT_OFFER', CTAContextFixture)

      result?.onPress && result.onPress()

      expect(analytics.logConsultAvailableDates).toHaveBeenCalledWith(offerResponseSnap.id)
      expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })
  })

  describe('Book offer CTA', () => {
    it('should trigger logConsultErrorApplicationModal log at pressing', () => {
      const result = getCTAProps('BOOK_OFFER', CTAContextFixture)

      result.onPress && result.onPress()

      expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })
  })

  describe('Digital offer CTA', () => {
    const mockBookOffer = jest.fn()

    it('should trigger book offer at pressing when offer not already booked and stock available', () => {
      const result = getCTAProps('DIGITAL_OFFER', {
        ...CTAContextFixture,
        bookOffer: mockBookOffer,
      })

      result.onPress && result.onPress()

      expect(mockBookOffer).toHaveBeenNthCalledWith(1, {
        quantity: 1,
        stockId: offerResponseSnap.stocks[0].id,
      })
    })

    it('should trigger open url at pressing when offer already booked', () => {
      const result = getCTAProps('DIGITAL_OFFER', {
        ...CTAContextFixture,
        alreadyBookedOfferId: 1,
      })

      result.onPress && result.onPress()

      expect(mockOpenUrl).toHaveBeenNthCalledWith(1, 'https://www.google.com/')
    })
  })

  describe('Incomplete profile CTA', () => {
    it('should return incomplete profile props when profile info not stored', () => {
      const result = getCTAProps('INCOMPLETE_PROFILE', CTAContextFixture)

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        isDisabled: false,
        navigateTo: {
          params: { params: { type: 'booking' }, screen: 'SetName' },
          screen: 'SubscriptionStackNavigator',
        },
      })
    })

    it('should return incomplete profile props when profile info stored', () => {
      const result = getCTAProps('INCOMPLETE_PROFILE', {
        ...CTAContextFixture,
        storedProfileInfos: {
          name: { lastName: 'Dupont', firstName: 'John' },
          city: { name: 'Paris', code: '', postalCode: '75000', departementCode: '75' },
          address: '1 rue de la Paix',
          status: ActivityIdEnum.HIGH_SCHOOL_STUDENT,
        },
      })

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        isDisabled: false,
        navigateTo: {
          params: { params: { type: 'booking' }, screen: 'ProfileInformationValidationCreate' },
          screen: 'SubscriptionStackNavigator',
        },
      })
    })
  })

  describe('See booking CTA', () => {
    it('should trigger logViewedBookingPage log at pressing', () => {
      const result = getCTAProps('SEE_BOOKING', CTAContextFixture)

      result.onPress && result.onPress()

      expect(analytics.logViewedBookingPage).toHaveBeenNthCalledWith(1, {
        offerId: offerResponseSnap.id,
        from: 'offer',
      })
    })
  })

  describe('Subscription status CTA', () => {
    it('should trigger logConsultFinishSubscriptionModal log at pressing', () => {
      const result = getCTAProps('SUBSCRIPTION_STATUS', {
        ...CTAContextFixture,
        subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
      })

      result.onPress && result.onPress()

      expect(analytics.logConsultFinishSubscriptionModal).toHaveBeenNthCalledWith(
        1,
        offerResponseSnap.id
      )
    })
  })
})

describe('getCTAWordingAndAction', () => {
  const mockBookOffer = jest.fn()
  const defaultProps = {
    context: {
      offer: offerResponseSnap,
      isUnderageBeneficiary: false,
      bookOffer: mockBookOffer,
      isBookingLoading: false,
      booking: CTAContextFixture.booking,
    },
    enableBookingFreeOfferFifteenSixteen: true,
    userStatus: { statusType: YoungStatusType.beneficiary },
    hasEnoughCredit: true,
    isLoggedIn: true,
    subcategory: mockSubcategory,
    isEndedUsedBooking: false,
    user: beneficiaryUser,
  }

  describe('User not logged in', () => {
    it('should use authentication CTA when offer has no external url', () => {
      const result = getCTAWordingAndAction({ ...defaultProps, isLoggedIn: false })

      expect(result).toEqual(
        expect.objectContaining({
          isDisabled: false,
          modalToDisplay: OfferModal.AUTHENTICATION,
          movieScreeningUserData: { isUserLoggedIn: false },
          wording: DEFAULT_CTA_WORDING,
        })
      )
    })
  })

  it('should use external url CTA when offer has external url and ex beneficiary user', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: { ...offerResponseSnap, externalTicketOfficeUrl: 'https://www.google.com/' },
      },
      isLoggedIn: true,
    })

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should use external url CTA when offer has external url and user without enough credit', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: { ...offerResponseSnap, externalTicketOfficeUrl: 'https://www.google.com/' },
      },
      isLoggedIn: true,
      hasEnoughCredit: false,
    })

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should use 15 16 CTA when offer is not free and user eligibility is free', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      isLoggedIn: true,
      user: { ...nonBeneficiaryUser, eligibility: EligibilityType.free },
    })

    expect(result).toEqual({
      bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
      isDisabled: true,
      wording: 'Réserver l’offre',
    })
  })

  describe('Free digital offers', () => {
    describe('Subcategory is not event', () => {
      it('should return digital offer CTA', () => {
        const result = getCTAWordingAndAction({
          ...defaultProps,
          subcategory: { ...mockSubcategory, isEvent: false },
          userStatus: { statusType: YoungStatusType.beneficiary },
          context: {
            ...defaultProps.context,
            offer: {
              ...offerResponseSnap,
              isDigital: true,
              stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }],
            },
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            isDisabled: false,
            wording: 'Accéder à l’offre en ligne',
          })
        )
      })
    })

    describe('Subcategory is event', () => {
      it('should return see booking CTA if offer already booked', () => {
        const result = getCTAWordingAndAction({
          ...defaultProps,
          userStatus: { statusType: YoungStatusType.beneficiary },
          context: {
            ...defaultProps.context,
            offer: {
              ...offerResponseSnap,
              isDigital: true,
              stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }],
            },
            alreadyBookedOfferId: 1,
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            wording: 'Voir ma réservation',
            isDisabled: false,
            navigateTo: { screen: 'BookingDetails', params: { id: 1 }, fromRef: true },
            movieScreeningUserData: { hasBookedOffer: true, bookings: CTAContextFixture.booking },
          })
        )
      })

      it('should return book offer CTA if offer not booked', () => {
        const result = getCTAWordingAndAction({
          ...defaultProps,
          userStatus: { statusType: YoungStatusType.beneficiary },
          context: {
            ...defaultProps.context,
            offer: {
              ...offerResponseSnap,
              isDigital: true,
              stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }],
            },
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            wording: DEFAULT_CTA_WORDING,
            isDisabled: false,
            modalToDisplay: OfferModal.BOOKING,
          })
        )
      })
    })
  })

  describe('Free offers', () => {
    it('should return incomplete profile CTA when user egilibility is free and profile incomplete', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        isLoggedIn: true,
        user: { ...beneficiaryUser, eligibility: EligibilityType.free, firstName: undefined },
        context: {
          ...defaultProps.context,
          offer: {
            ...offerResponseSnap,
            stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }],
          },
        },
      })

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        isDisabled: false,
        navigateTo: {
          params: { params: { type: 'booking' }, screen: 'SetName' },
          screen: 'SubscriptionStackNavigator',
        },
      })
    })

    it('should return book offer CTA when user egilibility is free and profile complete', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        isLoggedIn: true,
        user: { ...beneficiaryUser, eligibility: EligibilityType.free },
        context: {
          ...defaultProps.context,
          offer: {
            ...offerResponseSnap,
            stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }],
          },
        },
      })

      expect(result).toEqual(
        expect.objectContaining({
          wording: DEFAULT_CTA_WORDING,
          isDisabled: false,
          modalToDisplay: OfferModal.BOOKING,
        })
      )
    })
  })

  it('should return ineligible props and offer has no external url', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: { ...offerResponseSnap, externalTicketOfficeUrl: undefined },
      },
      isLoggedIn: true,
      userStatus: { ...defaultProps.userStatus, statusType: YoungStatusType.non_eligible },
    })

    expect(result).toEqual({
      wording: DEFAULT_CTA_WORDING,
      bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
      isDisabled: true,
      movieScreeningUserData: { isUserEligible: false },
    })
  })

  it('should return ended used booking props when booking ended or used', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      isLoggedIn: true,
      isEndedUsedBooking: true,
    })

    expect(result).toEqual({
      wording: DEFAULT_CTA_WORDING,
      isDisabled: false,
      modalToDisplay: OfferModal.BOOKING,
      isEndedUsedBooking: true,
      movieScreeningUserData: { bookings: CTAContextFixture.booking },
    })
  })

  it('should return subscription status props when user eligible and not beneficiary', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      isLoggedIn: true,
      user: nonBeneficiaryUser,
      context: {
        ...defaultProps.context,
        subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
      },
      userStatus: {
        ...defaultProps.userStatus,
        statusType: YoungStatusType.eligible,
      },
    })

    expect(result).toEqual(
      expect.objectContaining({
        isDisabled: false,
        modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
        movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
        wording: 'Réserver l’offre',
      })
    )
  })

  it('should return see booking props when offer already booked', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      isLoggedIn: true,
      context: { ...defaultProps.context, alreadyBookedOfferId: offerResponseSnap.id },
    })

    expect(result).toEqual(
      expect.objectContaining({
        wording: 'Voir ma réservation',
        isDisabled: false,
        navigateTo: {
          screen: 'BookingDetails',
          params: { id: offerResponseSnap.id },
          fromRef: true,
        },
        movieScreeningUserData: { hasBookedOffer: true, bookings: CTAContextFixture.booking },
      })
    )
  })

  describe('Restrictions (educational / non-beneficiary / underage restricted)', () => {
    it('should return undefined wording for an educational offer without external URL', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        user: { ...beneficiaryUser, isBeneficiary: true },
        context: {
          ...defaultProps.context,
          offer: { ...offerResponseSnap, isEducational: true, externalTicketOfficeUrl: undefined },
        },
      })

      expect(result).toEqual({ wording: undefined })
    })

    it('should return undefined wording when user is NOT a beneficiary and no external URL', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        user: { ...beneficiaryUser, isBeneficiary: false },
        context: {
          ...defaultProps.context,
          offer: { ...offerResponseSnap, externalTicketOfficeUrl: undefined },
        },
      })

      expect(result).toEqual({ wording: undefined })
    })

    it('should return undefined wording when offer is forbidden to underage and user is underage beneficiary', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        context: {
          ...defaultProps.context,
          isUnderageBeneficiary: true,
          offer: {
            ...offerResponseSnap,
            isForbiddenToUnderage: true,
            externalTicketOfficeUrl: undefined,
          },
        },
      })

      expect(result).toEqual({ wording: undefined })
    })
  })

  it('should return external url CTA for educational offer if external URL is provided', () => {
    const externalUrl = 'https://www.google.com/'
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: {
          ...offerResponseSnap,
          isEducational: true,
          externalTicketOfficeUrl: externalUrl,
        },
      },
    })

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should return expired credit CTA when cinema offer and deposit expiration date is in the past', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
      user: {
        ...beneficiaryUser,
        depositExpirationDate: '2020-12-04',
      },
    })

    expect(result).toEqual({
      bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
      movieScreeningUserData: { isUserCreditExpired: true },
    })
  })

  describe('Offer availability (released and expired)', () => {
    it('should return expired offer CTA when the offer is not yet released', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        context: {
          ...defaultProps.context,
          offer: {
            ...offerResponseSnap,
            isReleased: false,
            isExpired: false,
          },
        },
      })

      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })

    it('should return expired offer CTA when the offer is expired', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        context: {
          ...defaultProps.context,
          offer: {
            ...offerResponseSnap,
            isReleased: true,
            isExpired: true,
          },
        },
      })

      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })
  })

  it('should return sold out offer CTA when the offer is sold out', () => {
    const result = getCTAWordingAndAction({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        offer: {
          ...offerResponseSnap,
          isSoldOut: true,
        },
      },
    })

    expect(result).toEqual({
      wording: 'Offre épuisée',
      isDisabled: true,
    })
  })

  describe('Booking a paid offer', () => {
    describe('When user has enough credit', () => {
      it('should return book event offer CTA when subcategory is an event', () => {
        const result = getCTAWordingAndAction({
          ...defaultProps,
          hasEnoughCredit: true,
          subcategory: { ...mockSubcategory, isEvent: true },
          context: {
            ...defaultProps.context,
            offer: { ...offerResponseSnap, isSoldOut: false, isReleased: true, isExpired: false },
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            wording: 'Voir les disponibilités',
            isDisabled: false,
            modalToDisplay: OfferModal.BOOKING,
            movieScreeningUserData: { hasEnoughCredit: true },
          })
        )
      })

      it('should return book offer CTA when subcategory is NOT an event', () => {
        const result = getCTAWordingAndAction({
          ...defaultProps,
          hasEnoughCredit: true,
          subcategory: { ...mockSubcategory, isEvent: false },
          context: {
            ...defaultProps.context,
            offer: { ...offerResponseSnap, isSoldOut: false, isReleased: true, isExpired: false },
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            wording: DEFAULT_CTA_WORDING,
            isDisabled: false,
            modalToDisplay: OfferModal.BOOKING,
          })
        )
      })
    })

    it('should return insufficient credit CTA when user has insufficient credit', () => {
      const result = getCTAWordingAndAction({
        ...defaultProps,
        hasEnoughCredit: false,
        subcategory: { ...mockSubcategory, isEvent: true },
        context: {
          ...defaultProps.context,
          offer: { ...offerResponseSnap, isSoldOut: false, isReleased: true, isExpired: false },
        },
      })

      expect(result).toEqual({
        wording: 'Crédit insuffisant',
        isDisabled: true,
      })
    })
  })
})
