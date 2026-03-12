import mockdate from 'mockdate'

import {
  EligibilityType,
  OfferResponse,
  SubcategoryIdEnum,
  SubcategoryResponseModelv2,
  SubscriptionStatus,
  YoungStatusResponse,
  YoungStatusType,
} from 'api/gen'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { DEFAULT_CTA_WORDING } from 'features/offerRefacto/constants'
import { CTAContextFixture } from 'features/offerRefacto/fixtures/CTAContext.fixture'
import { getCTAWordingAndAction } from 'features/offerRefacto/helpers'
import { CTAContext } from 'features/offerRefacto/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { OfferModal } from 'shared/offer/enums'

jest.mock('libs/firebase/analytics/analytics')

mockdate.set(new Date('2021-01-04T00:00:00Z'))

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

  type BuildGetCTAWordingAndActionType = {
    context?: Partial<CTAContext>
    userStatus?: Partial<YoungStatusResponse>
    hasEnoughCredit?: boolean
    isLoggedIn?: boolean
    subcategory?: Partial<SubcategoryResponseModelv2>
    isEndedUsedBooking?: boolean
    user?: Partial<UserProfileResponseWithoutSurvey>
    offer?: Partial<OfferResponse>
  }

  const buildGetCTAWordingAndAction = (props: BuildGetCTAWordingAndActionType) => {
    const {
      context,
      offer,
      user,
      userStatus,
      subcategory,
      hasEnoughCredit = defaultProps.hasEnoughCredit,
      isLoggedIn = defaultProps.isLoggedIn,
      isEndedUsedBooking = defaultProps.isEndedUsedBooking,
    } = props

    return {
      ...defaultProps,
      isLoggedIn,
      hasEnoughCredit,
      isEndedUsedBooking,
      user: { ...defaultProps.user, ...user },
      userStatus: { ...defaultProps.userStatus, ...userStatus },
      subcategory: { ...defaultProps.subcategory, ...subcategory },
      context: {
        ...defaultProps.context,
        ...context,
        offer: { ...defaultProps.context.offer, ...offer },
      },
    }
  }

  describe('User not logged in', () => {
    it('should use authentication CTA when offer has no external url', () => {
      const result = getCTAWordingAndAction(buildGetCTAWordingAndAction({ isLoggedIn: false }))

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
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        offer: { externalTicketOfficeUrl: 'https://www.google.com/' },
        isLoggedIn: true,
      })
    )

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should use external url CTA when offer has external url and user without enough credit', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        offer: { externalTicketOfficeUrl: 'https://www.google.com/' },
        isLoggedIn: true,
        hasEnoughCredit: false,
      })
    )

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should use 15 16 CTA when offer is not free and user eligibility is free', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({ user: { eligibility: EligibilityType.free } })
    )

    expect(result).toEqual({
      bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
      isDisabled: true,
      wording: 'Réserver l’offre',
    })
  })

  describe('Free digital offers', () => {
    describe('Subcategory is not event', () => {
      it('should return digital offer CTA', () => {
        const result = getCTAWordingAndAction(
          buildGetCTAWordingAndAction({
            subcategory: { isEvent: false },
            userStatus: { statusType: YoungStatusType.beneficiary },
            offer: { isDigital: true, stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }] },
          })
        )

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
        const result = getCTAWordingAndAction(
          buildGetCTAWordingAndAction({
            userStatus: { statusType: YoungStatusType.beneficiary },
            offer: { isDigital: true, stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }] },
            context: { alreadyBookedOfferId: 1 },
          })
        )

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
        const result = getCTAWordingAndAction(
          buildGetCTAWordingAndAction({
            userStatus: { statusType: YoungStatusType.beneficiary },
            offer: { isDigital: true, stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }] },
          })
        )

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
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          user: { eligibility: EligibilityType.free, firstName: undefined },
          offer: { stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }] },
        })
      )

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
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          user: { eligibility: EligibilityType.free },
          offer: { stocks: [{ ...offerResponseSnap.stocks[0], price: 0 }] },
        })
      )

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
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        offer: { externalTicketOfficeUrl: undefined },
        userStatus: { statusType: YoungStatusType.non_eligible },
      })
    )

    expect(result).toEqual({
      wording: DEFAULT_CTA_WORDING,
      bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
      isDisabled: true,
      movieScreeningUserData: { isUserEligible: false },
    })
  })

  it('should return ended used booking props when booking ended or used', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        isEndedUsedBooking: true,
      })
    )

    expect(result).toEqual({
      wording: DEFAULT_CTA_WORDING,
      isDisabled: false,
      modalToDisplay: OfferModal.BOOKING,
      isEndedUsedBooking: true,
      movieScreeningUserData: { bookings: CTAContextFixture.booking },
    })
  })

  it('should return subscription status props when user eligible and not beneficiary', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        user: nonBeneficiaryUser,
        context: { subscriptionStatus: SubscriptionStatus.has_to_complete_subscription },
        userStatus: { statusType: YoungStatusType.eligible },
      })
    )

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
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        context: { alreadyBookedOfferId: offerResponseSnap.id },
      })
    )

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
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          offer: { isEducational: true, externalTicketOfficeUrl: undefined },
        })
      )

      expect(result).toEqual({})
    })

    it('should return undefined wording when user is not a beneficiary and no external URL', () => {
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          user: nonBeneficiaryUser,
          offer: { externalTicketOfficeUrl: undefined },
        })
      )

      expect(result).toEqual({})
    })

    it('should return undefined wording when offer is forbidden to underage and user is underage beneficiary', () => {
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          context: { isUnderageBeneficiary: true },
          offer: { isForbiddenToUnderage: true, externalTicketOfficeUrl: undefined },
        })
      )

      expect(result).toEqual({})
    })
  })

  it('should return external url CTA for educational offer if external URL is provided', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        offer: { isEducational: true, externalTicketOfficeUrl: 'https://www.google.com/' },
      })
    )

    expect(result).toEqual({
      externalNav: { url: 'https://www.google.com/' },
      isDisabled: false,
      wording: 'Accéder au site partenaire',
    })
  })

  it('should return expired credit CTA when cinema offer and deposit expiration date is in the past', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({
        offer: { subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
        user: { depositExpirationDate: '2020-12-04' },
      })
    )

    expect(result).toEqual({
      bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
      movieScreeningUserData: { isUserCreditExpired: true },
    })
  })

  describe('Offer availability (released and expired)', () => {
    it('should return expired offer CTA when the offer is not yet released', () => {
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({ offer: { isReleased: false, isExpired: false } })
      )

      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })

    it('should return expired offer CTA when the offer is expired', () => {
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({ offer: { isReleased: true, isExpired: true } })
      )

      expect(result).toEqual({
        wording: 'Offre expirée',
        isDisabled: true,
      })
    })
  })

  it('should return sold out offer CTA when the offer is sold out', () => {
    const result = getCTAWordingAndAction(
      buildGetCTAWordingAndAction({ offer: { isSoldOut: true } })
    )

    expect(result).toEqual({
      wording: 'Offre épuisée',
      isDisabled: true,
    })
  })

  describe('Booking a paid offer', () => {
    describe('When user has enough credit', () => {
      it('should return book event offer CTA when subcategory is an event', () => {
        const result = getCTAWordingAndAction(
          buildGetCTAWordingAndAction({
            subcategory: { isEvent: true },
            offer: { isSoldOut: false, isReleased: true, isExpired: false },
            hasEnoughCredit: true,
          })
        )

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
        const result = getCTAWordingAndAction(
          buildGetCTAWordingAndAction({
            hasEnoughCredit: true,
            subcategory: { isEvent: false },
            offer: { isSoldOut: false, isReleased: true, isExpired: false },
          })
        )

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
      const result = getCTAWordingAndAction(
        buildGetCTAWordingAndAction({
          hasEnoughCredit: false,
          subcategory: { isEvent: true },
          offer: { isSoldOut: false, isReleased: true, isExpired: false },
        })
      )

      expect(result).toEqual({
        wording: 'Crédit insuffisant',
        isDisabled: true,
      })
    })
  })
})
