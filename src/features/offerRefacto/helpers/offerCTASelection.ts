import {
  EligibilityType,
  OfferResponse,
  SubcategoryIdEnum,
  SubcategoryResponseModelv2,
} from 'api/gen'
import { isAndWasBeneficiary } from 'features/auth/helpers/checkStatusType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import { isFreeDigitalOffer, isFreeOffer } from 'features/offerRefacto/helpers'
import { getCTAProps } from 'features/offerRefacto/helpers/offerCTAContent'
import {
  CTAType,
  CTAWordingAndAction,
  GetCTAWordingAndActionProps,
} from 'features/offerRefacto/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { UserProfile } from 'features/share/types'

export const getExternalUrlCTA = (
  offer: OfferResponse,
  hasEnoughCredit: boolean,
  user?: UserProfile
): CTAType | undefined => {
  const isExBeneficiary = user && isUserExBeneficiary(user)
  const userWithoutEnoughCredit = user?.statusType == UserStatusType.BENEFICIARY && !hasEnoughCredit
  const shouldBeRedirectedToExternalUrl =
    offer.externalTicketOfficeUrl && (userWithoutEnoughCredit || isExBeneficiary)
  if (shouldBeRedirectedToExternalUrl) {
    return 'EXTERNAL_URL'
  }

  return undefined
}

export const getFreeOfferCTA = (
  offer: OfferResponse,
  subcategory: SubcategoryResponseModelv2,
  user?: UserProfile,
  alreadyBookedOfferId?: number
): CTAType | undefined => {
  const isUserFreeStatus = user?.eligibility === EligibilityType.free

  if (isFreeDigitalOffer(offer) && user?.statusType !== UserStatusType.GENERAL_PUBLIC) {
    if (subcategory.isEvent) return alreadyBookedOfferId ? 'SEE_BOOKING' : 'BOOK_OFFER'
    return 'DIGITAL_OFFER'
  }

  const isProfileIncomplete = getIsProfileIncomplete(user)
  if (isFreeOffer(offer)) {
    if (isUserFreeStatus && isProfileIncomplete) {
      return 'INCOMPLETE_PROFILE'
    }
    if (!isProfileIncomplete) {
      // If the profile is complete we consider they can book a free offer
      return 'BOOK_OFFER'
    }
  }

  return undefined
}

export const getEligibilityBookingCTA = (
  offer: OfferResponse,
  user?: UserProfile,
  isEndedUsedBooking?: boolean,
  alreadyBookedOfferId?: number
): CTAType | undefined => {
  if (user?.statusType === UserStatusType.GENERAL_PUBLIC && !offer.externalTicketOfficeUrl) {
    return 'INELIGIBLE'
  }

  if (isEndedUsedBooking) {
    return 'ENDED_USED_BOOKING'
  }

  if (user?.statusType === UserStatusType.ELIGIBLE && !isAndWasBeneficiary(user)) {
    return 'SUBSCRIPTION_STATUS'
  }

  if (alreadyBookedOfferId) {
    return 'SEE_BOOKING'
  }

  return undefined
}

export const getRestrictedOfferCTA = (
  offer: OfferResponse,
  isUnderageBeneficiary: boolean,
  isBeneficiary?: boolean
): CTAType | undefined => {
  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    return offer.externalTicketOfficeUrl ? 'EXTERNAL_URL' : 'UNDEFINED'
  }

  return undefined
}

export const getExpirationSoldOutCTA = (
  offer: OfferResponse,
  user?: UserProfile
): CTAType | undefined => {
  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  if (isDepositExpired && isMovieScreeningOffer) return 'EXPIRED_CREDIT'

  if (!offer.isReleased || offer.isExpired) return 'EXPIRED_OFFER'
  if (offer.isSoldOut) return 'SOLD_OUT_OFFER'

  return undefined
}

export const getCTAWordingAndAction = ({
  context,
  hasEnoughCredit,
  isLoggedIn,
  subcategory,
  isEndedUsedBooking,
  user,
}: GetCTAWordingAndActionProps): CTAWordingAndAction => {
  const { offer, isUnderageBeneficiary, alreadyBookedOfferId } = context
  const { externalTicketOfficeUrl } = offer

  // 1. Authentication
  if (!isLoggedIn) {
    return getCTAProps(externalTicketOfficeUrl ? 'EXTERNAL_URL' : 'AUTHENTICATION', context)
  }

  // 2. Redirection
  const externalUrlCTA = getExternalUrlCTA(offer, hasEnoughCredit, user)
  if (externalUrlCTA) {
    return getCTAProps(externalUrlCTA, context)
  }

  // 3. User 15/16 years old (no bookings for paid offers)
  const isUserFreeStatus = user?.eligibility === EligibilityType.free
  if (isUserFreeStatus && !isFreeOffer(offer)) {
    return getCTAProps('USER_15_16', context)
  }

  // 4. Free offers and specific status
  const freeOfferCTA = getFreeOfferCTA(offer, subcategory, user, alreadyBookedOfferId)
  if (freeOfferCTA) {
    return getCTAProps(freeOfferCTA, context)
  }

  // 5. Eligibility and reservation status
  const eligibilityBookingCTA = getEligibilityBookingCTA(
    offer,
    user,
    isEndedUsedBooking,
    alreadyBookedOfferId
  )
  if (eligibilityBookingCTA) {
    return getCTAProps(eligibilityBookingCTA, context)
  }

  // 6. Restrictions categories / educational offers
  const restrictedOfferCTA = getRestrictedOfferCTA(
    offer,
    isUnderageBeneficiary,
    isAndWasBeneficiary(user)
  )
  if (restrictedOfferCTA) {
    return getCTAProps(restrictedOfferCTA, context)
  }

  // 7. Expiration and stocks (beneficiaries only)
  const expirationSoldOutCTA = getExpirationSoldOutCTA(offer, user)
  if (expirationSoldOutCTA) {
    return getCTAProps(expirationSoldOutCTA, context)
  }

  // 8. Booking a paid offer or insufficient credit
  const bookOfferType = subcategory.isEvent ? 'BOOK_EVENT_OFFER' : 'BOOK_OFFER'
  const type = hasEnoughCredit ? bookOfferType : 'INSUFFICIENT_CREDIT'

  return getCTAProps(type, context)
}
