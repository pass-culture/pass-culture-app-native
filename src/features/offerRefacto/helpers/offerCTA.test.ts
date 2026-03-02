import { ActivityIdEnum, SubscriptionStatus } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { DEFAULT_CTA_WORDING } from 'features/offerRefacto/constants'
import { CTAContextFixture } from 'features/offerRefacto/fixtures/CTAContext.fixture'
import {
  getBaseProps,
  getCTAProps,
  getInsufficientCreditWording,
  getSpecificsMovieScreeningOffer,
  getSubscriptionCTAProps,
} from 'features/offerRefacto/helpers'
import { analytics } from 'libs/analytics/provider'
import { OfferModal } from 'shared/offer/enums'

jest.mock('libs/firebase/analytics/analytics')
const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

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
    it('should return authentication props', () => {
      const result = getCTAProps('AUTHENTICATION', CTAContextFixture)

      expect(result).toEqual(
        expect.objectContaining({
          wording: DEFAULT_CTA_WORDING,
          isDisabled: false,
          modalToDisplay: OfferModal.AUTHENTICATION,
          movieScreeningUserData: { isUserLoggedIn: false },
        })
      )
    })

    it('should trigger logConsultAuthenticationModal log at pressing', () => {
      const result = getCTAProps('AUTHENTICATION', CTAContextFixture)

      result?.onPress && result.onPress()

      expect(analytics.logConsultAuthenticationModal).toHaveBeenCalledWith(offerResponseSnap.id)
    })
  })

  describe('Book event offer CTA', () => {
    it('should return book event offer props', () => {
      const result = getCTAProps('BOOK_EVENT_OFFER', CTAContextFixture)

      expect(result).toEqual(
        expect.objectContaining({
          wording: 'Voir les disponibilités',
          isDisabled: false,
          modalToDisplay: OfferModal.BOOKING,
          movieScreeningUserData: { hasEnoughCredit: true },
        })
      )
    })

    it('should trigger logConsultAvailableDates and logClickBookOffer logs at pressing', () => {
      const result = getCTAProps('BOOK_EVENT_OFFER', CTAContextFixture)

      result?.onPress && result.onPress()

      expect(analytics.logConsultAvailableDates).toHaveBeenCalledWith(offerResponseSnap.id)
      expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })
  })

  describe('Book offer CTA', () => {
    it('should return book offer props', () => {
      const result = getCTAProps('BOOK_OFFER', CTAContextFixture)

      expect(result).toEqual(
        expect.objectContaining({
          wording: DEFAULT_CTA_WORDING,
          isDisabled: false,
          modalToDisplay: OfferModal.BOOKING,
        })
      )
    })

    it('should trigger logConsultErrorApplicationModal log at pressing', () => {
      const result = getCTAProps('BOOK_OFFER', CTAContextFixture)

      result.onPress && result.onPress()

      expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })
  })

  describe('Digital offer CTA', () => {
    const mockBookOffer = jest.fn()

    it('should return digital offer props', () => {
      const result = getCTAProps('DIGITAL_OFFER', CTAContextFixture)

      expect(result).toEqual(
        expect.objectContaining({
          wording: 'Accéder à l’offre en ligne',
          isDisabled: false,
        })
      )
    })

    it('should trigger book offer at pressing when offer not already booked and stock available', () => {
      const result = getCTAProps('DIGITAL_OFFER', {
        ...CTAContextFixture,
        isAlreadyBookedOffer: false,
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
        isAlreadyBookedOffer: true,
      })

      result.onPress && result.onPress()

      expect(mockOpenUrl).toHaveBeenNthCalledWith(1, 'https://www.google.com/')
    })
  })

  describe('Ended used booking CTA', () => {
    it('should return ended used booking props', () => {
      const result = getCTAProps('ENDED_USED_BOOKING', CTAContextFixture)

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        isDisabled: false,
        modalToDisplay: OfferModal.BOOKING,
        isEndedUsedBooking: true,
        movieScreeningUserData: { bookings: CTAContextFixture.booking },
      })
    })
  })

  describe('Expired credit CTA', () => {
    it('should return expired credit props', () => {
      const result = getCTAProps('EXPIRED_CREDIT', CTAContextFixture)

      expect(result).toEqual({
        bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
        movieScreeningUserData: { isUserCreditExpired: true },
      })
    })
  })

  describe('Expired offer CTA', () => {
    it('should return expired offer props', () => {
      const result = getCTAProps('EXPIRED_OFFER', CTAContextFixture)

      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })
  })

  describe('External URL CTA', () => {
    it('should return expired offer props', () => {
      const result = getCTAProps('EXTERNAL_URL', {
        ...CTAContextFixture,
        offer: { ...offerResponseSnap, externalTicketOfficeUrl: 'https://www.google.com/' },
      })

      expect(result).toEqual({
        wording: 'Accéder au site partenaire',
        isDisabled: false,
        externalNav: { url: 'https://www.google.com/' },
      })
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

  describe('Ineligible CTA', () => {
    it('should return ineligible props', () => {
      const result = getCTAProps('INELIGIBLE', CTAContextFixture)

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
        isDisabled: true,
        movieScreeningUserData: { isUserEligible: false },
      })
    })
  })

  describe('Insufficient credit CTA', () => {
    it('should return insufficient credit props', () => {
      const result = getCTAProps('INSUFFICIENT_CREDIT', CTAContextFixture)

      expect(result).toEqual({
        wording: 'Crédit insuffisant',
        isDisabled: true,
      })
    })
  })

  describe('See booking CTA', () => {
    it('should return see booking props', () => {
      const result = getCTAProps('SEE_BOOKING', { ...CTAContextFixture, alreadyBookedOfferId: 1 })

      expect(result).toEqual(
        expect.objectContaining({
          wording: 'Voir ma réservation',
          isDisabled: false,
          navigateTo: { screen: 'BookingDetails', params: { id: 1 }, fromRef: true },
          movieScreeningUserData: { hasBookedOffer: true, bookings: CTAContextFixture.booking },
        })
      )
    })

    it('should trigger logViewedBookingPage log at pressing', () => {
      const result = getCTAProps('SEE_BOOKING', CTAContextFixture)

      result.onPress && result.onPress()

      expect(analytics.logViewedBookingPage).toHaveBeenNthCalledWith(1, {
        offerId: offerResponseSnap.id,
        from: 'offer',
      })
    })
  })

  describe('Sold out offer CTA', () => {
    it('should return sold out offer props', () => {
      const result = getCTAProps('SOLD_OUT_OFFER', CTAContextFixture)

      expect(result).toEqual({
        wording: 'Offre épuisée',
        isDisabled: true,
      })
    })
  })

  describe('Subscription status CTA', () => {
    it('should return subscription status props', () => {
      const result = getCTAProps('SUBSCRIPTION_STATUS', {
        ...CTAContextFixture,
        subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
      })

      expect(result).toEqual(
        expect.objectContaining({
          wording: DEFAULT_CTA_WORDING,
          isDisabled: false,
          modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
          movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
        })
      )
    })

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

  describe('User 15 16 CTA', () => {
    it('should return insufficient credit props', () => {
      const result = getCTAProps('USER_15_16', CTAContextFixture)

      expect(result).toEqual({
        wording: DEFAULT_CTA_WORDING,
        isDisabled: true,
        bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
      })
    })
  })
})
