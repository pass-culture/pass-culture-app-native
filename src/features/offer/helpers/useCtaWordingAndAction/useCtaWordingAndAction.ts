import { useRoute } from '@react-navigation/native'
import { UseMutateFunction } from '@tanstack/react-query'
import { useEffect } from 'react'

import { ApiError } from 'api/ApiError'
import {
  BookingReponse,
  BookOfferRequest,
  BookOfferResponse,
  EligibilityType,
  FavoriteOfferResponse,
  OfferResponseV2,
  RecommendationApiParams,
  SubcategoryIdEnum,
  SubscriptionStatus,
  UserProfileResponse,
  YoungStatusResponse,
  YoungStatusType,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import {
  ValidStoredProfileInfos,
  useStoredProfileInfos,
} from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { Referrals, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { BottomBannerTextEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { PlaylistType } from 'features/offer/enums'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { getIsFreeOffer } from 'features/offer/helpers/getIsFreeOffer/getIsFreeOffer'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import {
  HasEnoughCredit,
  useHasEnoughCredit,
} from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Subcategory } from 'libs/subcategories/types'
import { useEndedBookingFromOfferIdQuery, useBookingsQuery } from 'queries/bookings'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { OfferModal } from 'shared/offer/enums'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

type UseGetCtaWordingAndActionProps = {
  offer: OfferResponseV2
  subcategory: Subcategory
  from?: Referrals
  searchId?: string
}

const getIsBookedOffer = (
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponse['bookedOffers'] = {}
): boolean => bookedOffersIds[offerId] !== undefined

type Props = {
  isLoggedIn: boolean
  user?: UserProfileResponse
  userStatus: YoungStatusResponse
  isBeneficiary: boolean
  offer: OfferResponseV2
  subcategory: Subcategory
  hasEnoughCreditData: HasEnoughCredit
  isUnderageBeneficiary: boolean
  isEndedUsedBooking?: boolean
  bottomBannerText?: string
  isDisabled?: boolean
  bookOffer: UseMutateFunction<BookOfferResponse, Error | ApiError, BookOfferRequest>
  isBookingLoading: boolean
  booking: BookingReponse | null | undefined
  from?: Referrals
  searchId?: string
  isDepositExpired?: boolean
  apiRecoParams?: RecommendationApiParams
  playlistType?: PlaylistType
  storedProfileInfos?: ValidStoredProfileInfos
  featureFlags: { enableBookingFreeOfferFifteenSixteen: boolean; wipEnableLoanFakeDoor?: boolean }
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
type OneOrTwoCTAs = [ICTAWordingAndAction] | [ICTAWordingAndAction, ICTAWordingAndAction]

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  user,
  userStatus,
  isBeneficiary,
  offer,
  subcategory,
  hasEnoughCreditData,
  isUnderageBeneficiary,
  isEndedUsedBooking,
  bookOffer,
  isBookingLoading,
  booking,
  from,
  searchId,
  isDepositExpired,
  apiRecoParams,
  playlistType,
  storedProfileInfos,
  featureFlags,
}: Props): OneOrTwoCTAs | undefined => {
  const { externalTicketOfficeUrl, subcategoryId } = offer

  const isAlreadyBookedOffer = getIsBookedOffer(offer.id, user?.bookedOffers)
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  const enableLoanCTA =
    offer?.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER && featureFlags.wipEnableLoanFakeDoor

  const enableBookingFreeOfferFifteenSixteen = featureFlags.enableBookingFreeOfferFifteenSixteen
  const { hasEnoughCredit, message: hasEnoughCreditMessage } = hasEnoughCreditData
  const wording = enableLoanCTA ? 'Acheter' : 'Réserver l’offre'

  const isUserFreeStatus = user?.eligibility === EligibilityType.free
  const isFreeOffer = getIsFreeOffer(offer)
  const isNotFreeOffer = !isFreeOffer
  const isProfileIncomplete = getIsProfileIncomplete(user)
  const isEligibleFreeOffer15To16 = enableBookingFreeOfferFifteenSixteen && isUserFreeStatus
  const userWithNotEnoughCredit =
    userStatus.statusType == YoungStatusType.beneficiary && !hasEnoughCredit
  const isExBeneficiary = user && isUserExBeneficiary(user)
  const shouldBeRedirectedToExternalUrl =
    externalTicketOfficeUrl && (userWithNotEnoughCredit || isExBeneficiary)

  const bookLoanModal = {
    modalToDisplay: OfferModal.SURVEY,
    wording: 'Emprunter',
    isDisabled: false,
    onPress: () => analytics.logHasClickedFakeDoorCTA({ offerId: offer.id, userId: user?.id }),
  }

  if (!isLoggedIn) {
    if (externalTicketOfficeUrl)
      return [
        {
          wording: 'Accéder au site partenaire',
          externalNav: { url: externalTicketOfficeUrl },
          isDisabled: false,
        },
      ]
    if (enableLoanCTA)
      return [
        {
          modalToDisplay: OfferModal.AUTHENTICATION,
          wording: isMovieScreeningOffer ? undefined : wording,
          isDisabled: false,
          onPress: () => analytics.logConsultAuthenticationModal(offer.id),
          movieScreeningUserData: { isUserLoggedIn: isLoggedIn },
        },
        bookLoanModal,
      ]
    return [
      {
        modalToDisplay: OfferModal.AUTHENTICATION,
        wording: isMovieScreeningOffer ? undefined : wording,
        isDisabled: false,
        onPress: () => analytics.logConsultAuthenticationModal(offer.id),
        movieScreeningUserData: { isUserLoggedIn: isLoggedIn },
      },
    ]
  }

  if (shouldBeRedirectedToExternalUrl) {
    return [
      {
        wording: 'Accéder au site partenaire',
        externalNav: { url: externalTicketOfficeUrl },
        isDisabled: false,
      },
    ]
  }

  if (isEligibleFreeOffer15To16) {
    if (isProfileIncomplete) {
      if (isFreeOffer) {
        return [
          {
            wording: 'Réserver l’offre',
            isDisabled: false,
            navigateTo: getSubscriptionPropConfig(
              storedProfileInfos ? 'ProfileInformationValidationCreate' : 'SetName',
              { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 }
            ),
          },
        ]
      }

      return [
        {
          wording: 'Réserver l’offre',
          isDisabled: true,
          bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
        },
      ]
    }

    if (isNotFreeOffer) {
      return [
        {
          wording: 'Réserver l’offre',
          isDisabled: true,
          bottomBannerText: 'À 15 et 16 ans, tu peux réserver uniquement des offres gratuites.',
        },
      ]
    }

    return [
      {
        wording: 'Réserver l’offre',
        modalToDisplay: OfferModal.BOOKING,
        isDisabled: false,
      },
    ]
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !externalTicketOfficeUrl) {
    return [
      {
        wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
        bottomBannerText: BottomBannerTextEnum.NOT_ELIGIBLE,
        isDisabled: true,
        movieScreeningUserData: { isUserEligible: false },
      },
    ]
  }

  if (isEndedUsedBooking) {
    return [
      {
        modalToDisplay: OfferModal.BOOKING,
        wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
        isEndedUsedBooking,
        isDisabled: false,
        bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
        movieScreeningUserData: { bookings: booking as BookingReponse },
      },
    ]
  }

  if (userStatus.statusType === YoungStatusType.eligible && !isBeneficiary) {
    const common = {
      wording: isMovieScreeningOffer ? undefined : 'Réserver l’offre',
      isDisabled: false,
    }
    switch (userStatus.subscriptionStatus) {
      case SubscriptionStatus.has_to_complete_subscription:
        return [
          {
            ...common,
            modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
            onPress: () => analytics.logConsultFinishSubscriptionModal(offer.id),
            movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
          },
        ]

      case SubscriptionStatus.has_subscription_pending:
        return [
          {
            ...common,
            modalToDisplay: OfferModal.APPLICATION_PROCESSING,
            onPress: () => analytics.logConsultApplicationProcessingModal(offer.id),
            movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
          },
        ]

      case SubscriptionStatus.has_subscription_issues:
        return [
          {
            ...common,
            modalToDisplay: OfferModal.ERROR_APPLICATION,
            onPress: () => analytics.logConsultErrorApplicationModal(offer.id),
            movieScreeningUserData: { hasNotCompletedSubscriptionYet: true },
          },
        ]
      case undefined:
      case null:
        return
    }
  }

  if (isFreeDigitalOffer && userStatus?.statusType !== YoungStatusType.non_eligible) {
    if (subcategory.isEvent) {
      if (!isAlreadyBookedOffer) {
        return [
          {
            modalToDisplay: OfferModal.BOOKING,
            wording: 'Réserver l’offre',
            isDisabled: false,
            onPress: () => {
              analytics.logClickBookOffer({
                offerId: offer.id,
                from,
                searchId,
                ...apiRecoParams,
                playlistType,
              })
            },
          },
        ]
      }
      return [
        {
          wording: 'Voir ma réservation',
          isDisabled: false,
          navigateTo: {
            screen: 'BookingDetails',
            params: { id: user?.bookedOffers[offer.id] },
            fromRef: true,
          },
          onPress: () => analytics.logViewedBookingPage({ offerId: offer.id, from: 'offer' }),
          bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
          movieScreeningUserData: { hasBookedOffer: true, bookings: booking as BookingReponse },
        },
      ]
    }
    return [
      {
        wording: getDigitalOfferBookingWording(subcategoryId),
        isDisabled: isBookingLoading,
        onPress() {
          if (isAlreadyBookedOffer) {
            openUrl(booking?.completedUrl ?? '')
            return
          }
          if (offer.stocks[0]?.id) {
            bookOffer({ quantity: 1, stockId: offer.stocks[0].id })
          }
        },
      },
    ]
  }

  if (isAlreadyBookedOffer) {
    return [
      {
        wording: 'Voir ma réservation',
        isDisabled: false,
        navigateTo: {
          screen: 'BookingDetails',
          params: { id: user?.bookedOffers[offer.id] },
          fromRef: true,
        },
        onPress: () => analytics.logViewedBookingPage({ offerId: offer.id, from: 'offer' }),
        bottomBannerText: isMovieScreeningOffer ? BottomBannerTextEnum.ALREADY_BOOKED : undefined,
        movieScreeningUserData: { hasBookedOffer: true, bookings: booking as BookingReponse },
      },
    ]
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isLoggedIn || !isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return [{ wording: undefined }]

    return [
      {
        wording: 'Accéder au site partenaire',
        externalNav: { url: externalTicketOfficeUrl },
        isDisabled: false,
      },
    ]
  }

  // Beneficiary
  if (isDepositExpired && isMovieScreeningOffer)
    return [
      {
        bottomBannerText: BottomBannerTextEnum.CREDIT_HAS_EXPIRED,
        movieScreeningUserData: { isUserCreditExpired: true },
      },
    ]

  if (!offer.isReleased || offer.isExpired) return [{ wording: 'Offre expirée', isDisabled: true }]
  if (offer.isSoldOut)
    return [{ wording: isMovieScreeningOffer ? undefined : 'Offre épuisée', isDisabled: true }]

  if (!subcategory.isEvent) {
    if (!hasEnoughCredit) {
      if (offer.isDigital && !isUnderageBeneficiary)
        return [
          {
            wording: 'Crédit numérique insuffisant',
            isDisabled: true,
            bottomBannerText: hasEnoughCreditMessage,
          },
        ]
      if (enableLoanCTA)
        return [
          {
            wording: 'Crédit insuffisant',
            isDisabled: true,
            bottomBannerText: hasEnoughCreditMessage,
          },
          bookLoanModal,
        ]
      return [
        {
          wording: 'Crédit insuffisant',
          isDisabled: true,
          bottomBannerText: hasEnoughCreditMessage,
        },
      ]
    }

    if (enableLoanCTA)
      return [
        {
          modalToDisplay: OfferModal.BOOKING,
          wording,
          isDisabled: false,
          onPress: () => {
            analytics.logClickBookOffer({
              offerId: offer.id,
              from,
              searchId,
              ...apiRecoParams,
              playlistType,
            })
          },
        },
        bookLoanModal,
      ]
    return [
      {
        modalToDisplay: OfferModal.BOOKING,
        wording: 'Réserver l’offre',
        isDisabled: false,
        onPress: () => {
          analytics.logClickBookOffer({
            offerId: offer.id,
            from,
            searchId,
            ...apiRecoParams,
            playlistType,
          })
        },
      },
    ]
  }

  if (subcategory.isEvent) {
    if (!hasEnoughCredit)
      return [
        {
          wording: isMovieScreeningOffer ? undefined : 'Crédit insuffisant',
          bottomBannerText: isMovieScreeningOffer
            ? BottomBannerTextEnum.NOT_ENOUGH_CREDIT
            : hasEnoughCreditMessage,
          movieScreeningUserData: { isUserLoggedIn: isLoggedIn, hasEnoughCredit },
          isDisabled: true,
        },
      ]

    return [
      {
        modalToDisplay: OfferModal.BOOKING,
        wording: isMovieScreeningOffer ? undefined : 'Voir les disponibilités',
        isDisabled: false,
        onPress: () => {
          analytics.logConsultAvailableDates(offer.id)
          analytics.logClickBookOffer({
            offerId: offer.id,
            from,
            searchId,
            ...apiRecoParams,
            playlistType,
          })
        },
        movieScreeningUserData: { hasEnoughCredit },
      },
    ]
  }
  return undefined
}

export const useCtaWordingAndAction = (props: UseGetCtaWordingAndActionProps) => {
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const wipEnableLoanFakeDoor = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_LOAN_FAKEDOOR)

  const storedProfileInfos = useStoredProfileInfos()

  const { offer, from, searchId, subcategory } = props
  const offerId = offer.id

  const { isLoggedIn, user } = useAuthContext()

  const hasEnoughCredit = useHasEnoughCredit(offer)
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const { data: endedBooking } = useEndedBookingFromOfferIdQuery(offerId)
  const { showErrorSnackBar } = useSnackBarContext()
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
    const isEligibleFreeOffer15To16 = enableBookingFreeOfferFifteenSixteen && isUserFreeStatus

    if (isLoggedIn && isEligibleFreeOffer15To16 && isProfileIncomplete && isFreeOffer) {
      freeOfferIdActions.setFreeOfferId(offer.id)
    }
  }, [isLoggedIn, enableBookingFreeOfferFifteenSixteen, user, offer])

  async function redirectToBookingAction(response: BookOfferResponse) {
    const bookings = await getBookings()

    const booking = bookings.data?.ongoing_bookings.find(
      (booking) => booking.id === response.bookingId
    )

    if (booking) {
      openUrl(booking.completedUrl ?? '')
    }
  }

  const { mutate: bookOffer, isLoading: isBookingLoading } = useBookOfferMutation({
    onSuccess(data) {
      analytics.logBookingConfirmation({
        ...apiRecoParams,
        offerId,
        bookingId: data.bookingId,
        fromOfferId,
        fromMultivenueOfferId,
        playlistType,
      })

      redirectToBookingAction(data)
    },
    onError() {
      const message = 'Désolé, il est impossible d’ouvrir le lien. Réessaie plus tard.'
      showErrorSnackBar({ message, timeout: SNACK_BAR_TIME_OUT })
    },
  })
  const { isBeneficiary = false, bookedOffers = {}, status } = user ?? {}
  const { data: booking } = useOngoingOrEndedBookingQuery(
    getBookingOfferId(offerId, bookedOffers) ?? 0
  )
  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   * The venue.id is not available on Homepage, or wherever we click on an offer
   * and preload the Offer details page. As a result, checking that venue.id
   * exists is equivalent to making sure the API call is successful.
   */
  if (isLoggedIn === null || user === null || !offer.venue.id) return

  const userStatus = status?.statusType ? status : { statusType: YoungStatusType.non_eligible }
  return getCtaWordingAndAction({
    isLoggedIn,
    user,
    userStatus,
    isBeneficiary,
    offer,
    subcategory,
    hasEnoughCreditData: hasEnoughCredit,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    isUnderageBeneficiary,
    bookOffer,
    isBookingLoading,
    booking,
    from,
    searchId,
    isDepositExpired,
    apiRecoParams,
    playlistType,
    featureFlags: { enableBookingFreeOfferFifteenSixteen, wipEnableLoanFakeDoor },
    storedProfileInfos,
  })
}
