import { BookingReponse, OfferResponseV2, SubcategoryIdEnum, SubscriptionStatus } from 'api/gen'
import { ValidStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { analytics } from 'libs/analytics/provider'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { OfferModal } from 'shared/offer/enums'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

type CTAInfos = {
  wording: string
  isDisabled: boolean
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
  externalNav?: ExternalNavigationProps['externalNav']
}

type BottomBannerInfos = {
  text: string
}

type ModalInfos = {
  modalToDisplay: OfferModal
}

type MovieScreeningBookingData = {
  movieScreeningUserData: MovieScreeningUserData
}

export const getLoggedOutCTA = (offer: OfferResponseV2): ICTAWordingAndAction => ({
  wording: offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE ? undefined : 'Réserver l’offre',
  isDisabled: false,
  onPress: () => analytics.logConsultAuthenticationModal(offer.id),
})

export const getLoggedOutModal = (): ModalInfos => ({
  modalToDisplay: OfferModal.AUTHENTICATION,
})
export const getLoggedOutScreeningData = (): MovieScreeningBookingData => ({
  movieScreeningUserData: { isUserLoggedIn: true },
})

export const getIsProfileIncompleteAndFreeOffer = (
  storedProfileInfos: ValidStoredProfileInfos | undefined,
  callback: () => void
) => {
  callback?.()
  return getIsProfileIncompleteAndFreeOfferCTA(storedProfileInfos)
}

export const getIsProfileIncompleteAndFreeOfferCTA = (
  storedProfileInfos: ValidStoredProfileInfos | undefined
): CTAInfos => {
  const { name, city, address, status } = storedProfileInfos ?? {}
  const isValid =
    name?.firstName && name?.lastName && city?.name && city?.postalCode && address && status
  return {
    wording: 'Réserver l’offre',
    isDisabled: false,
    navigateTo: {
      screen: isValid ? 'SetName' : 'ProfileInformationValidation',
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    },
  }
}

export const getNotFreeOfferCTA = (): CTAInfos => ({
  wording: 'Réserver l’offre',
  isDisabled: true,
  navigateTo: undefined,
})

export const getNotFreeOfferBottomBanner = (): BottomBannerInfos => ({
  text: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
})

export const getFreeOfferBookableCTA = (): CTAInfos => ({
  wording: 'Réserver l’offre',
  isDisabled: false,
  navigateTo: undefined,
})

export const getFreeOfferBookableModal = (): ModalInfos => ({
  modalToDisplay: OfferModal.BOOKING,
})

export const getNonEligibleAndNonExternalTicketCTA = (
  isMovieScreeningOffer: boolean
): CTAInfos => ({
  wording: isMovieScreeningOffer ? '' : 'Réserver l’offre',
  isDisabled: true,
  navigateTo: undefined,
})

export const getNonEligibleAndNonExternalTicketScreeningData = (): MovieScreeningBookingData => ({
  movieScreeningUserData: { isUserEligible: false },
})

export const getNonEligibleAndNonExternalTicketBannerText = (): BottomBannerInfos => ({
  text: BottomBannerTextEnum.NOT_ELIGIBLE,
})

export const getEndedUsedBookingCTA = (isMovieScreeningOffer: boolean) => ({
  wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
  isDisabled: false,
  navigateTo: undefined,
})

export const getEndedUsedBookingModal = (): ModalInfos => ({
  modalToDisplay: OfferModal.BOOKING,
})

export const getEndedUsedBookingBanner = (isMovieScreeningOffer: boolean): BottomBannerInfos => ({
  text: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : '',
})

export const getEndedUsedBookingScreeningData = (
  booking: BookingReponse
): MovieScreeningBookingData => ({
  movieScreeningUserData: { bookings: booking },
})

export const getEndedUsedBookingEndedUsedBooking = () => ({
  isEndedUsedBooking: true,
})

export const getEligibleAndNotBenificiaryCTA = (
  isMovieScreeningOffer: boolean,
  offerId: number
) => ({
  wording: isMovieScreeningOffer ? '' : 'Réserver l’offre',
  isDisabled: false,
  onPress: () => analytics.logConsultFinishSubscriptionModal(offerId),
})

export const getEligibleAndNotBenificiaryScreeningData = () => ({
  movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
})

const mapper = {
  [SubscriptionStatus.has_to_complete_subscription]: OfferModal.FINISH_SUBSCRIPTION,
  [SubscriptionStatus.has_subscription_pending]: OfferModal.APPLICATION_PROCESSING,
  [SubscriptionStatus.has_subscription_issues]: OfferModal.ERROR_APPLICATION,
}
export const getEligibleAndNotBenificiaryModal = (
  subscriptionStatus: SubscriptionStatus
): ModalInfos => ({
  modalToDisplay: mapper[subscriptionStatus],
})

export const getFreeDigitalEventAlreadyBookedCTA = (
  bookedOffers: { [key: string]: number } | undefined,
  offerId: number
): CTAInfos => ({
  wording: 'Voir ma réservation',
  isDisabled: false,
  navigateTo: {
    screen: 'BookingDetails',
    params: { id: bookedOffers?.[offerId] },
    fromRef: true,
  },
  onPress: () => analytics.logViewedBookingPage({ offerId, from: 'offer' }),
})

export const getFreeDigitalEventBanner = (isMovieScreeningOffer: boolean): BottomBannerInfos => ({
  text: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : '',
})

export const getFreeDigitalEventMovieScreen = (
  booking: BookingReponse
): MovieScreeningBookingData => ({
  movieScreeningUserData: { hasBookedOffer: true, bookings: booking },
})

export const getFreeDigitalEventCTA = (onPress: () => void) => ({
  wording: 'Réserver l’offre',
  isDisabled: false,
  onPress,
})

export const getFreeDigitalEventAlreadyBookedModal = () => ({
  modalToDisplay: OfferModal.BOOKING,
})

export const getIsEventCTA = (
  subcategoryId: SubcategoryIdEnum,
  isBookingLoading: boolean,
  onPress: () => void
) => ({
  wording: getDigitalOfferBookingWording(subcategoryId),
  isDisabled: isBookingLoading,
  onPress,
})

export const getAlreadyBookedCTA = (
  bookedOffers: { [key: string]: number } | undefined,
  offerId: number
): CTAInfos => ({
  wording: 'Voir ma réservation',
  isDisabled: false,
  navigateTo: {
    screen: 'BookingDetails',
    params: { id: bookedOffers?.[offerId] },
    fromRef: true,
  },
  onPress: () => analytics.logViewedBookingPage({ offerId, from: 'offer' }),
})

export const getAlreadyBookedBanner = (isMovieScreeningOffer: boolean): BottomBannerInfos => ({
  text: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : '',
})

export const getAlreadyBookedScreeningData = (
  booking: BookingReponse
): MovieScreeningBookingData => ({
  movieScreeningUserData: { hasBookedOffer: true, bookings: booking },
})

export const getExternalCTA = (externalTicketOfficeUrl: string): CTAInfos => ({
  wording: 'Accéder au site partenaire',
  externalNav: { url: externalTicketOfficeUrl },
  isDisabled: false,
})

export const getExpiredDepositBanner = (): BottomBannerInfos => ({
  text: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
})

export const getExpiredScreeningData = (): MovieScreeningBookingData => ({
  movieScreeningUserData: { isUserCreditExpired: true },
})

export const getDisabledOfferCTA = () => ({ wording: 'Offre expirée', isDisabled: true })

export const getSoldOutCTA = (isMovieScreeningOffer: boolean) => ({
  wording: isMovieScreeningOffer ? undefined : 'Offre épuisée',
  isDisabled: true,
})

export const getUnsufficientNumericalCreditCTA = () => ({
  wording: 'Crédit numérique insuffisant',
  isDisabled: true,
})

export const getUnsufficientCreditCTA = () => ({
  wording: 'Crédit insuffisant',
  isDisabled: true,
})

export const getOfferIsNotEventCTA = (onPress: () => void) => ({
  modalToDisplay: OfferModal.BOOKING,
  wording: 'Réserver l’offre',
  isDisabled: false,
  onPress,
})

export const getOfferIsEventNotEnoughCreditCTA = (isMovieScreeningOffer: boolean) => ({
  wording: isMovieScreeningOffer ? undefined : 'Crédit insuffisant',
  bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.NOT_ENOUGH_CREDIT : undefined,
  isDisabled: true,
})

export const getOfferIsEventNotEnoughCreditScreeningData = (
  isLoggedIn: boolean,
  hasEnoughCredit: boolean
) => ({
  movieScreeningUserData: { isUserLoggedIn: isLoggedIn, hasEnoughCredit },
})

export const getOfferIsEventCTA = (isMovieScreeningOffer: boolean, onPress: () => void) => ({
  modalToDisplay: OfferModal.BOOKING,
  wording: isMovieScreeningOffer ? undefined : 'Voir les disponibilités',
  isDisabled: false,
  onPress,
})

export const getOfferIsEventModal = () => ({
  modalToDisplay: OfferModal.BOOKING,
})

export const getOfferIsEventScreeningData = (hasEnoughCredit: boolean) => ({
  movieScreeningUserData: { hasEnoughCredit },
})
