import { SubcategoryIdEnum, SubscriptionStatus } from 'api/gen'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { DEFAULT_CTA_WORDING } from 'features/offerRefacto/constants'
import { CTAContext, CTAType, ICTAWordingAndAction } from 'features/offerRefacto/types'
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
        if (isAlreadyBookedOffer) {
          return openUrl(booking?.completedUrl ?? '')
        }
        if (offer.stocks[0]?.id) {
          return bookOffer({ quantity: 1, stockId: offer.stocks[0].id })
        }
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
    UNDEFINED: {},
    USER_15_16: {
      wording: DEFAULT_CTA_WORDING,
      isDisabled: true,
      bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
    },
  }

  return CONFIG[type]
}
