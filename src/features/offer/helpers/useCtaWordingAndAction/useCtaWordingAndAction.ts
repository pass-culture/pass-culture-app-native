import { useRoute } from '@react-navigation/native'
import { useEffect } from 'react'

import {
  BookingReponse,
  BookOfferResponse,
  CurrencyEnum,
  EligibilityType,
  OfferResponse,
  RecommendationApiParams,
  SubcategoryIdEnum,
  SubscriptionStatus,
  UserRole,
  YoungStatusType,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { Referrals, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsFreeOffer } from 'features/offer/helpers/getIsFreeOffer/getIsFreeOffer'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import { getUserHasEnoughCredit } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { Subcategory } from 'libs/subcategories/types'
import { useBookingsQuery, useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { OfferModal } from 'shared/offer/enums'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'

type UseGetCtaWordingAndActionProps = {
  offer: OfferResponse
  subcategory: Subcategory
  from?: Referrals
  searchId?: string
}

export type ICTAWordingAndAction = {
  modalToDisplay?: OfferModal
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  onPress?: () => void
  isEndedUsedBooking?: boolean
  bottomBannerText?: string
  isDisabled?: boolean
  movieScreeningUserData?: MovieScreeningUserData
}

export const useCtaWordingAndAction = (props: UseGetCtaWordingAndActionProps) => {
  const storedProfileInfos = useStoredProfileInfos()

  const { offer, from, searchId } = props
  const { isLoggedIn, user } = useAuthContext()
  const currency =
    user?.currency === CurrencyEnum.XPF ? Currency.PACIFIC_FRANC_SHORT : Currency.EURO
  const price = getOfferPrice(offer.stocks)
  const hasEnoughCreditData = getUserHasEnoughCredit(
    currency,
    price,
    offer.expenseDomains,
    user?.domainsCredit
  )
  const isUnderageBeneficiary =
    user?.roles?.some((role) => role === UserRole.UNDERAGE_BENEFICIARY) ?? false
  const route = useRoute<UseRouteType<'Offer'>>()
  const apiRecoParams: RecommendationApiParams = route.params.apiRecoParams
    ? JSON.parse(route.params.apiRecoParams)
    : undefined
  const playlistType = route.params.playlistType
  const fromOfferId = route.params.fromOfferId
  const fromMultivenueOfferId = route.params.fromMultivenueOfferId
  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false

  const { refetch: getBookings } = useBookingsQuery()

  useEffect(() => {
    const isUserFreeStatus = user?.eligibility === EligibilityType.free
    const isFreeOffer = getIsFreeOffer(offer)
    const isProfileIncomplete = getIsProfileIncomplete(user)

    if (isLoggedIn && isUserFreeStatus && isProfileIncomplete && isFreeOffer) {
      freeOfferIdActions.setFreeOfferId(offer.id)
    }
  }, [isLoggedIn, user, offer])

  async function redirectToBookingAction(response: BookOfferResponse) {
    const bookings = await getBookings()

    const booking = bookings.data?.ongoing_bookings.find(
      (booking) => booking.id === response.bookingId
    )

    if (booking) {
      void openUrl(booking.completedUrl ?? '')
    }
  }

  const { mutate: bookOffer, isPending: isBookingLoading } = useBookOfferMutation({
    onSuccess(data) {
      void analytics.logBookingConfirmation({
        ...apiRecoParams,
        offerId: offer.id.toString(),
        bookingId: data.bookingId.toString(),
        fromOfferId: fromOfferId?.toString(),
        fromMultivenueOfferId: fromMultivenueOfferId?.toString(),
        playlistType,
      })

      void redirectToBookingAction(data)
    },
    onError() {
      const message = 'Désolé, il est impossible d’ouvrir le lien. Réessaie plus tard.'
      showErrorSnackBar(message)
    },
  })
  // isBeneficiary = isUnderageBeneficiary || isBeneficiary || isFreeBeneficiary
  // bookedOffers = not cancelled bookings
  const { isBeneficiary = false, bookedOffers = {}, status } = user ?? {}
  const { data: booking } = useOngoingOrEndedBookingQuery(
    getBookingOfferId(offer.id, bookedOffers) ?? 0
  )
  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   * The venue.id is not available on Homepage, or wherever we click on an offer
   * and preload the Offer details page. As a result, checking that venue.id
   * exists is equivalent to making sure the API call is successful.
   */
  if (isLoggedIn === null || user === null || !offer.venue.id) return

  const userStatus = status?.statusType ? status : { statusType: YoungStatusType.non_eligible }

  const isAlreadyBookedOffer = !!user?.bookedOffers[offer.id]
  const { data: endedBooking } = useEndedBookingFromOfferIdQuery(offer.id, false)
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const { hasEnoughCredit, message: hasEnoughCreditMessage } = hasEnoughCreditData

  const isFreeOffer = offer.stocks.length > 0 && offer.stocks.some((stock) => stock.price === 0)
  const isProfileComplete =
    user &&
    [user.firstName, user.lastName, user.postalCode, user.city, user.activityId].every(Boolean)

  if (!offer.isReleased) return { wording: 'Offre indisponible', isDisabled: true }
  if (offer.isExpired) return { wording: 'Offre expirée', isDisabled: true }
  if (offer.isSoldOut)
    return { wording: isMovieScreeningOffer ? undefined : 'Offre épuisée', isDisabled: true }

  if (!isLoggedIn && offer.externalTicketOfficeUrl)
    return {
      wording: 'Accéder au site partenaire',
      externalNav: { url: offer.externalTicketOfficeUrl },
      isDisabled: false,
    }
  if (!isLoggedIn && !offer.externalTicketOfficeUrl)
    return {
      modalToDisplay: OfferModal.AUTHENTICATION,
      wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
      isDisabled: false,
      onPress: () => analytics.logConsultAuthenticationModal(offer.id),
      movieScreeningUserData: { isUserLoggedIn: false },
    }

  if (
    offer.externalTicketOfficeUrl &&
    ((userStatus.statusType == YoungStatusType.beneficiary && !hasEnoughCreditData) ||
      (user && isUserExBeneficiary(user)))
  ) {
    return {
      wording: 'Accéder au site partenaire',
      externalNav: { url: offer.externalTicketOfficeUrl },
      isDisabled: false,
    }
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (
    (!isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) &&
    offer.externalTicketOfficeUrl
  )
    return {
      wording: 'Accéder au site partenaire',
      externalNav: { url: offer.externalTicketOfficeUrl },
      isDisabled: false,
    }

  if (
    (!isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) &&
    !offer.externalTicketOfficeUrl
  )
    return {}

  if (user?.eligibility === EligibilityType.free && !isFreeOffer) {
    return {
      wording: 'Réserver l’offre',
      isDisabled: true,
      bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
    }
  }

  // non_elibible means user has never been beneficiary, means never could have booked anything
  if (
    isFreeOffer &&
    offer.isDigital &&
    userStatus?.statusType !== YoungStatusType.non_eligible &&
    offer.isEvent &&
    !isAlreadyBookedOffer
  ) {
    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: 'Réserver l’offre',
      isDisabled: false,
      onPress: () => {
        void analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      },
    }
  }
  if (
    isFreeOffer &&
    offer.isDigital &&
    userStatus?.statusType !== YoungStatusType.non_eligible &&
    offer.isEvent &&
    isAlreadyBookedOffer
  ) {
    return {
      wording: 'Voir ma réservation',
      isDisabled: false,
      navigateTo: {
        screen: 'BookingDetails',
        params: { id: endedBooking?.id },
        fromRef: true,
      },
      onPress: () => analytics.logViewedBookingPage({ offerId: offer.id, from: 'offer' }),
      bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
      movieScreeningUserData: { hasBookedOffer: true, bookings: booking as BookingReponse },
    }
  }
  if (
    isFreeOffer &&
    offer.isDigital &&
    userStatus?.statusType !== YoungStatusType.non_eligible &&
    !offer.isEvent &&
    isAlreadyBookedOffer
  )
    return {
      wording: getDigitalOfferBookingWording(offer.subcategoryId),
      isDisabled: isBookingLoading,
      onPress() {
        openUrl(booking?.completedUrl ?? '')
        return
      },
    }
  if (
    isFreeOffer &&
    offer.isDigital &&
    userStatus?.statusType !== YoungStatusType.non_eligible &&
    !offer.isEvent &&
    !isAlreadyBookedOffer
  )
    return {
      wording: getDigitalOfferBookingWording(offer.subcategoryId),
      isDisabled: isBookingLoading,
      onPress() {
        if (offer.stocks[0]?.id) {
          bookOffer({ quantity: 1, stockId: offer.stocks[0].id })
        }
      },
    }

  if (isFreeOffer && user?.eligibility === EligibilityType.free && !isProfileComplete) {
    return {
      wording: 'Réserver l’offre',
      isDisabled: false,
      navigateTo: getSubscriptionPropConfig(
        storedProfileInfos ? 'ProfileInformationValidationCreate' : 'SetName',
        { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 }
      ),
    }
  }
  if (isFreeOffer && isProfileComplete) {
    // If the profile is complete we consider they can book a free offer
    return {
      wording: 'Réserver l’offre',
      modalToDisplay: OfferModal.BOOKING,
      isDisabled: false,
      onPress: () => {
        void analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      },
    }
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !offer.externalTicketOfficeUrl) {
    return {
      wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
      bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
      isDisabled: true,
      movieScreeningUserData: { isUserEligible: false },
    }
  }

  if (endedBooking?.dateUsed) {
    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
      isEndedUsedBooking: true,
      isDisabled: false,
      bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
      movieScreeningUserData: { bookings: booking as BookingReponse },
    }
  }

  if (userStatus.statusType === YoungStatusType.eligible && !isBeneficiary) {
    const common = {
      wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
      isDisabled: false,
    }
    switch (userStatus.subscriptionStatus) {
      case SubscriptionStatus.has_to_complete_subscription:
        return {
          ...common,
          modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
          onPress: () => analytics.logConsultFinishSubscriptionModal(offer.id),
          movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
        }

      case SubscriptionStatus.has_subscription_pending:
        return {
          ...common,
          modalToDisplay: OfferModal.APPLICATION_PROCESSING,
          onPress: () => analytics.logConsultApplicationProcessingModal(offer.id),
          movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
        }

      case SubscriptionStatus.has_subscription_issues:
        return {
          ...common,
          modalToDisplay: OfferModal.ERROR_APPLICATION,
          onPress: () => analytics.logConsultErrorApplicationModal(offer.id),
          movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
        }

      case undefined:
      case null:
        return
    }
  }

  if (isAlreadyBookedOffer) {
    return {
      wording: 'Voir ma réservation',
      isDisabled: false,
      navigateTo: {
        screen: 'BookingDetails',
        params: { id: endedBooking?.id },
        fromRef: true,
      },
      onPress: () => analytics.logViewedBookingPage({ offerId: offer.id, from: 'offer' }),
      bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
      movieScreeningUserData: { hasBookedOffer: true, bookings: booking as BookingReponse },
    }
  }

  // Beneficiary
  if (isDepositExpired && isMovieScreeningOffer)
    return {
      bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
      movieScreeningUserData: { isUserCreditExpired: true },
    }

  if (!offer.isEvent && !hasEnoughCredit && offer.isDigital && !isUnderageBeneficiary)
    return {
      wording: 'Crédit numérique insuffisant',
      isDisabled: true,
      bottomBannerText: hasEnoughCreditMessage,
    }
  if (!offer.isEvent && !hasEnoughCredit && !(offer.isDigital && !isUnderageBeneficiary))
    return {
      wording: 'Crédit insuffisant',
      isDisabled: true,
      bottomBannerText: hasEnoughCreditMessage,
    }
  if (!offer.isEvent && hasEnoughCredit)
    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: 'Réserver l’offre',
      isDisabled: false,
      onPress: () => {
        void analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      },
    }

  if (offer.isEvent && !hasEnoughCredit)
    return {
      wording: isMovieScreeningOffer ? undefined : 'Crédit insuffisant',
      bottomBannerText: isMovieScreeningOffer
        ? BottomBannerTextEnum.NOT_ENOUGH_CREDIT
        : hasEnoughCreditMessage,
      movieScreeningUserData: { isUserLoggedIn: true, hasEnoughCredit: false },
      isDisabled: true,
    }

  if (offer.isEvent && hasEnoughCredit)
    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: isMovieScreeningOffer ? undefined : 'Voir les disponibilités',
      isDisabled: false,
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
    }

  return undefined
}
