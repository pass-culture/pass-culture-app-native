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
