import { EligibilityType, SubcategoryIdEnum, SubscriptionStatus, YoungStatusType } from 'api/gen'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import { DEFAULT_CTA_WORDING } from 'features/offerRefacto/constants'
import { getIsFreeDigitalOffer, getIsFreeOffer } from 'features/offerRefacto/helpers'
import {
  CTAContext,
  CTAType,
  GetCTAWordingAndActionProps,
  ICTAWordingAndAction,
} from 'features/offerRefacto/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { OfferModal } from 'shared/offer/enums'

export const getBaseProps = (isMovieScreeningOffer: boolean): Partial<ICTAWordingAndAction> => ({
  wording: isMovieScreeningOffer ? undefined : DEFAULT_CTA_WORDING,
  isDisabled: false,
})

export const getInsufficientCreditWording = (isDigital: boolean, isUnderageBeneficiary: boolean) =>
  isDigital && !isUnderageBeneficiary ? 'Crédit numérique insuffisant' : 'Crédit insuffisant'

type GetSpecificsMovieScreeningOfferType = {
  type: CTAType
  isMovieScreeningOffer: boolean
  isDigital: boolean
  isUnderageBeneficiary: boolean
  hasEnoughCreditMessage?: string
}

export function getSpecificsMovieScreeningOffer({
  type,
  isMovieScreeningOffer,
  isDigital,
  isUnderageBeneficiary,
  hasEnoughCreditMessage,
}: GetSpecificsMovieScreeningOfferType): Partial<ICTAWordingAndAction> {
  switch (type) {
    case 'BOOK_EVENT_OFFER':
      return { wording: isMovieScreeningOffer ? undefined : 'Voir les disponibilités' }
    case 'ENDED_USED_BOOKING':
    case 'SEE_BOOKING':
      return isMovieScreeningOffer ? { bottomBannerText: BottomBannerTextEnum.ALREADY_BOOKED } : {}
    case 'INSUFFICIENT_CREDIT':
      return isMovieScreeningOffer
        ? {
            wording: undefined,
            bottomBannerText: BottomBannerTextEnum.NOT_ENOUGH_CREDIT,
            movieScreeningUserData: { isUserLoggedIn: true, hasEnoughCredit: false },
          }
        : {
            wording: getInsufficientCreditWording(isDigital, isUnderageBeneficiary),
            bottomBannerText: hasEnoughCreditMessage,
          }

    case 'SOLD_OUT_OFFER':
      return { wording: isMovieScreeningOffer ? undefined : 'Offre épuisée' }
    default:
      return {}
  }
}

export function getSubscriptionCTAProps(
  offerId: number,
  status?: SubscriptionStatus | null
): Partial<ICTAWordingAndAction> {
  const map = {
    [SubscriptionStatus.has_to_complete_subscription]: {
      modal: OfferModal.FINISH_SUBSCRIPTION,
      log: analytics.logConsultFinishSubscriptionModal,
    },
    [SubscriptionStatus.has_subscription_pending]: {
      modal: OfferModal.APPLICATION_PROCESSING,
      log: analytics.logConsultApplicationProcessingModal,
    },
    [SubscriptionStatus.has_subscription_issues]: {
      modal: OfferModal.ERROR_APPLICATION,
      log: analytics.logConsultErrorApplicationModal,
    },
  }
  const match = status ? map[status] : undefined
  return match
    ? {
        modalToDisplay: match.modal,
        onPress: () => match.log(offerId),
        movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
      }
    : {}
}

export const getCTAProps = (type: CTAType, context: CTAContext): ICTAWordingAndAction => {
  const {
    offer,
    bookOffer,
    isUnderageBeneficiary,
    booking,
    isBookingLoading,
    from,
    searchId,
    apiRecoParams,
    playlistType,
    subscriptionStatus,
    storedProfileInfos,
    hasEnoughCreditMessage,
    alreadyBookedOfferId,
  } = context
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  const isDigital = offer.isDigital
  const base = getBaseProps(isMovieScreeningOffer)
  const isAlreadyBookedOffer = !!alreadyBookedOfferId

  const CONFIG: Record<CTAType, Partial<ICTAWordingAndAction>> = {
    AUTHENTICATION: {
      ...base,
      modalToDisplay: OfferModal.AUTHENTICATION,
      onPress: () => analytics.logConsultAuthenticationModal(offer.id),
      movieScreeningUserData: { isUserLoggedIn: false },
    },
    BOOK_EVENT_OFFER: {
      ...base,
      ...getSpecificsMovieScreeningOffer({
        type: 'BOOK_EVENT_OFFER',
        isMovieScreeningOffer,
        isDigital,
        isUnderageBeneficiary,
        hasEnoughCreditMessage,
      }),
      modalToDisplay: OfferModal.BOOKING,
      onPress: () => {
        void analytics.logConsultAvailableDates(offer.id)
        void analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      },
      movieScreeningUserData: { hasEnoughCredit: true },
    },
    BOOK_OFFER: {
      ...base,
      modalToDisplay: OfferModal.BOOKING,
      onPress: () =>
        analytics.logClickBookOffer({
          offerId: offer.id,
          from: from,
          searchId: searchId,
          ...apiRecoParams,
          playlistType: playlistType,
        }),
    },
    DIGITAL_OFFER: {
      wording: getDigitalOfferBookingWording(offer.subcategoryId),
      isDisabled: isBookingLoading,
      onPress: () => {
        if (isAlreadyBookedOffer) return openUrl(booking?.completedUrl ?? '')
        if (offer.stocks[0]?.id) {
          bookOffer({ quantity: 1, stockId: offer.stocks[0].id })
        }
        return
      },
    },
    ENDED_USED_BOOKING: {
      ...base,
      ...getSpecificsMovieScreeningOffer({
        type: 'ENDED_USED_BOOKING',
        isMovieScreeningOffer,
        isDigital,
        isUnderageBeneficiary,
        hasEnoughCreditMessage,
      }),
      modalToDisplay: OfferModal.BOOKING,
      isEndedUsedBooking: true,
      movieScreeningUserData: { bookings: booking ?? undefined },
    },
    EXPIRED_CREDIT: {
      bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
      movieScreeningUserData: { isUserCreditExpired: true },
    },
    EXPIRED_OFFER: { wording: 'Offre expirée', isDisabled: true },
    EXTERNAL_URL: {
      wording: 'Accéder au site partenaire',
      externalNav: { url: offer.externalTicketOfficeUrl ?? '' },
      isDisabled: false,
    },
    INCOMPLETE_PROFILE: {
      wording: DEFAULT_CTA_WORDING,
      isDisabled: false,
      navigateTo: getSubscriptionPropConfig(
        storedProfileInfos ? 'ProfileInformationValidationCreate' : 'SetName',
        { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 }
      ),
    },
    INELIGIBLE: {
      ...base,
      bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
      isDisabled: true,
      movieScreeningUserData: { isUserEligible: false },
    },
    INSUFFICIENT_CREDIT: {
      ...getSpecificsMovieScreeningOffer({
        type: 'INSUFFICIENT_CREDIT',
        isMovieScreeningOffer,
        isDigital,
        isUnderageBeneficiary,
        hasEnoughCreditMessage,
      }),
      isDisabled: true,
    },
    SEE_BOOKING: {
      wording: 'Voir ma réservation',
      isDisabled: false,
      navigateTo: { screen: 'BookingDetails', params: { id: alreadyBookedOfferId }, fromRef: true },
      ...getSpecificsMovieScreeningOffer({
        type: 'SEE_BOOKING',
        isMovieScreeningOffer,
        isDigital,
        isUnderageBeneficiary,
        hasEnoughCreditMessage,
      }),
      onPress: () => analytics.logViewedBookingPage({ offerId: offer.id, from: 'offer' }),
      movieScreeningUserData: { hasBookedOffer: true, bookings: booking ?? undefined },
    },
    SOLD_OUT_OFFER: {
      ...getSpecificsMovieScreeningOffer({
        type: 'SOLD_OUT_OFFER',
        isMovieScreeningOffer,
        isDigital,
        isUnderageBeneficiary,
        hasEnoughCreditMessage,
      }),
      isDisabled: true,
    },
    SUBSCRIPTION_STATUS: {
      ...base,
      ...getSubscriptionCTAProps(offer.id, subscriptionStatus),
    },
    USER_15_16: {
      wording: DEFAULT_CTA_WORDING,
      isDisabled: true,
      bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
    },
  }

  return CONFIG[type]
}

export const getCTAWordingAndAction = ({
  context,
  enableBookingFreeOfferFifteenSixteen,
  userStatus,
  hasEnoughCredit,
  isLoggedIn,
  subcategory,
  isEndedUsedBooking,
  user,
}: GetCTAWordingAndActionProps): ICTAWordingAndAction | undefined => {
  const { offer, isUnderageBeneficiary } = context
  const { externalTicketOfficeUrl, subcategoryId } = offer

  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const isMovieScreeningOffer = subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  const isUserFreeStatus = user?.eligibility === EligibilityType.free
  const isFreeOffer = getIsFreeOffer(offer)
  const isNotFreeOffer = !isFreeOffer
  const isProfileIncomplete = getIsProfileIncomplete(user)
  const isEligibleFreeOffer15To16 = enableBookingFreeOfferFifteenSixteen && isUserFreeStatus
  const userWithNotEnoughCredit =
    userStatus.statusType == YoungStatusType.beneficiary && !hasEnoughCredit
  const isBeneficiary = user?.isBeneficiary
  const isExBeneficiary = user && isUserExBeneficiary(user)
  const shouldBeRedirectedToExternalUrl =
    externalTicketOfficeUrl && (userWithNotEnoughCredit || isExBeneficiary)
  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false
  const isAlreadyBookedOffer = !!user?.bookedOffers[offer.id]

  if (!isLoggedIn) {
    return getCTAProps(externalTicketOfficeUrl ? 'EXTERNAL_URL' : 'AUTHENTICATION', context)
  }

  if (shouldBeRedirectedToExternalUrl) {
    return getCTAProps('EXTERNAL_URL', context)
  }

  if (isEligibleFreeOffer15To16 && isNotFreeOffer) {
    return getCTAProps('USER_15_16', context)
  }

  if (isFreeDigitalOffer && userStatus?.statusType !== YoungStatusType.non_eligible) {
    if (subcategory.isEvent) {
      return getCTAProps(isAlreadyBookedOffer ? 'SEE_BOOKING' : 'BOOK_OFFER', context)
    }
    return getCTAProps('DIGITAL_OFFER', context)
  }

  if (isFreeOffer) {
    if (isEligibleFreeOffer15To16 && isProfileIncomplete) {
      return getCTAProps('INCOMPLETE_PROFILE', context)
    }
    if (!isProfileIncomplete) {
      // If the profile is complete we consider they can book a free offer
      return getCTAProps('BOOK_OFFER', context)
    }
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !externalTicketOfficeUrl) {
    return getCTAProps('INELIGIBLE', context)
  }

  if (isEndedUsedBooking) {
    return getCTAProps('ENDED_USED_BOOKING', context)
  }

  if (userStatus.statusType === YoungStatusType.eligible && !isBeneficiary) {
    return getCTAProps('SUBSCRIPTION_STATUS', context)
  }

  if (isAlreadyBookedOffer) {
    return getCTAProps('SEE_BOOKING', context)
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isLoggedIn || !isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return { wording: undefined }

    return getCTAProps('EXTERNAL_URL', context)
  }

  // Beneficiary
  if (isDepositExpired && isMovieScreeningOffer) return getCTAProps('EXPIRED_CREDIT', context)

  if (!offer.isReleased || offer.isExpired) return getCTAProps('EXPIRED_OFFER', context)
  if (offer.isSoldOut) return getCTAProps('SOLD_OUT_OFFER', context)

  if (!subcategory.isEvent) {
    return getCTAProps(hasEnoughCredit ? 'BOOK_OFFER' : 'INSUFFICIENT_CREDIT', context)
  }

  if (subcategory.isEvent) {
    return getCTAProps(hasEnoughCredit ? 'BOOK_EVENT_OFFER' : 'INSUFFICIENT_CREDIT', context)
  }
  return undefined
}
