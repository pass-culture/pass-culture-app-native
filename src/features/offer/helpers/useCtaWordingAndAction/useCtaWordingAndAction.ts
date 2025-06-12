import { useRoute } from '@react-navigation/native'
import { UseMutateFunction } from 'react-query'

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
import { openUrl } from 'features/navigation/helpers/openUrl'
import { Referrals, UseRouteType } from 'features/navigation/RootNavigator/types'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { PlaylistType } from 'features/offer/enums'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { getIsFreeOffer } from 'features/offer/helpers/getIsFreeOffer/getIsFreeOffer'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import {
  getAlreadyBookedBanner,
  getAlreadyBookedCTA,
  getAlreadyBookedScreeningData,
  getDisabledOfferCTA,
  getEligibleAndNotBenificiaryCTA,
  getEligibleAndNotBenificiaryModal,
  getEligibleAndNotBenificiaryScreeningData,
  getEndedUsedBookingBanner,
  getEndedUsedBookingCTA,
  getEndedUsedBookingEndedUsedBooking,
  getEndedUsedBookingModal,
  getEndedUsedBookingScreeningData,
  getExpiredDepositBanner,
  getExpiredScreeningData,
  getExternalCTA,
  getFreeDigitalEventAlreadyBookedCTA,
  getFreeDigitalEventAlreadyBookedModal,
  getFreeDigitalEventBanner,
  getFreeDigitalEventCTA,
  getFreeDigitalEventMovieScreen,
  getFreeOfferBookableCTA,
  getFreeOfferBookableModal,
  getIsEventCTA,
  getIsProfileIncompleteAndFreeOffer,
  getLoggedOutCTA,
  getLoggedOutModal,
  getLoggedOutScreeningData,
  getNonEligibleAndNonExternalTicketBannerText,
  getNonEligibleAndNonExternalTicketCTA,
  getNonEligibleAndNonExternalTicketScreeningData,
  getNotFreeOfferBottomBanner,
  getNotFreeOfferCTA,
  getOfferIsEventCTA,
  getOfferIsEventModal,
  getOfferIsEventNotEnoughCreditCTA,
  getOfferIsEventNotEnoughCreditScreeningData,
  getOfferIsEventScreeningData,
  getOfferIsNotEventCTA,
  getSoldOutCTA,
  getUnsufficientCreditCTA,
  getUnsufficientNumericalCreditCTA,
} from 'features/offer/helpers/useCtaWordingAndAction/useCTANewGen'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Subcategory } from 'libs/subcategories/types'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings/useEndedBookingFromOfferIdQuery'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { OfferModal } from 'shared/offer/enums'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

import { useHasEnoughCredit } from '../useHasEnoughCredit/useHasEnoughCredit'

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
  hasEnoughCredit: boolean
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
  featureFlags: { enableBookingFreeOfferFifteenSixteen: boolean }
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

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  user,
  userStatus,
  isBeneficiary,
  offer,
  subcategory,
  hasEnoughCredit,
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
}: Props): ICTAWordingAndAction | undefined => {
  const { externalTicketOfficeUrl, subcategoryId } = offer

  const isAlreadyBookedOffer = getIsBookedOffer(offer.id, user?.bookedOffers)
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const { setFreeOfferId } = freeOfferIdActions

  const enableBookingFreeOfferFifteenSixteen = featureFlags.enableBookingFreeOfferFifteenSixteen
  const isUserFreeStatus = user?.eligibility === EligibilityType.free
  const isFreeOffer = getIsFreeOffer(offer)
  const isNotFreeOffer = !isFreeOffer
  const isProfileIncomplete = getIsProfileIncomplete(user)

  const isEligibleFreeOffer15To16 = enableBookingFreeOfferFifteenSixteen && isUserFreeStatus

  if (!isLoggedIn) {
    return { ...getLoggedOutCTA(offer), ...getLoggedOutModal(), ...getLoggedOutScreeningData() }
  }

  if (isEligibleFreeOffer15To16) {
    if (isNotFreeOffer) return { ...getNotFreeOfferCTA(), ...getNotFreeOfferBottomBanner() }

    if (!isProfileIncomplete)
      return { ...getFreeOfferBookableCTA(), ...getFreeOfferBookableModal() }

    return getIsProfileIncompleteAndFreeOffer(() => setFreeOfferId(offer.id))(storedProfileInfos)
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !externalTicketOfficeUrl) {
    return {
      ...getNonEligibleAndNonExternalTicketCTA(isMovieScreeningOffer),
      ...getNonEligibleAndNonExternalTicketScreeningData(),
      ...getNonEligibleAndNonExternalTicketBannerText(),
    }
  }

  if (isEndedUsedBooking) {
    return {
      ...getEndedUsedBookingCTA(isMovieScreeningOffer),
      ...getEndedUsedBookingModal(),
      ...getEndedUsedBookingBanner(isMovieScreeningOffer),
      ...getEndedUsedBookingScreeningData(booking as BookingReponse),
      ...getEndedUsedBookingEndedUsedBooking(),
    }
  }

  if (userStatus.statusType === YoungStatusType.eligible && !isBeneficiary) {
    if (userStatus.subscriptionStatus) {
      return {
        ...getEligibleAndNotBenificiaryCTA(isMovieScreeningOffer, offer.id),
        ...getEligibleAndNotBenificiaryScreeningData(),
        ...getEligibleAndNotBenificiaryModal(userStatus.subscriptionStatus),
      }
    }
    return
  }

  if (isFreeDigitalOffer && userStatus?.statusType !== YoungStatusType.non_eligible) {
    if (subcategory.isEvent) {
      return isAlreadyBookedOffer
        ? {
            ...getFreeDigitalEventAlreadyBookedCTA(user?.bookedOffers, offer.id),
            ...getFreeDigitalEventBanner(isMovieScreeningOffer),
            ...getFreeDigitalEventMovieScreen(booking as BookingReponse),
          }
        : {
            ...getFreeDigitalEventCTA(() => {
              analytics.logClickBookOffer({
                offerId: offer.id,
                from,
                searchId,
                ...apiRecoParams,
                playlistType,
              })
            }),
            ...getFreeDigitalEventAlreadyBookedModal(),
          }
    }
    return {
      ...getIsEventCTA(subcategoryId, isBookingLoading, () => {
        if (isAlreadyBookedOffer) {
          openUrl(booking?.completedUrl ?? '')
          return
        }
        if (offer.stocks[0]?.id) {
          bookOffer({ quantity: 1, stockId: offer.stocks[0].id })
        }
      }),
    }
  }

  if (isAlreadyBookedOffer) {
    return {
      ...getAlreadyBookedCTA(user?.bookedOffers, offer.id),
      ...getAlreadyBookedBanner(isMovieScreeningOffer),
      ...getAlreadyBookedScreeningData(booking as BookingReponse),
    }
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return undefined

    return {
      ...getExternalCTA(externalTicketOfficeUrl),
    }
  }

  // Beneficiary
  if (isDepositExpired && isMovieScreeningOffer)
    return {
      ...getExpiredDepositBanner(),
      ...getExpiredScreeningData(),
    }

  if (!offer.isReleased || offer.isExpired) return { ...getDisabledOfferCTA() }
  if (offer.isSoldOut) return { ...getSoldOutCTA(isMovieScreeningOffer) }

  if (!subcategory.isEvent) {
    if (!hasEnoughCredit) {
      if (offer.isDigital && !isUnderageBeneficiary)
        return { ...getUnsufficientNumericalCreditCTA() }
      return { ...getUnsufficientCreditCTA() }
    }

    return {
      ...getOfferIsNotEventCTA(() => {
        analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      }),
    }
  }

  if (subcategory.isEvent) {
    if (!hasEnoughCredit)
      return {
        ...getOfferIsEventNotEnoughCreditCTA(isMovieScreeningOffer),
        ...getOfferIsEventNotEnoughCreditScreeningData(isLoggedIn, hasEnoughCredit),
      }

    return {
      ...getOfferIsEventCTA(isMovieScreeningOffer, () => {
        analytics.logConsultAvailableDates(offer.id)
        analytics.logClickBookOffer({
          offerId: offer.id,
          from,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      }),
      ...getOfferIsEventModal(),
      ...getOfferIsEventScreeningData(hasEnoughCredit),
    }
  }
  return undefined
}

export const useCtaWordingAndAction = (props: UseGetCtaWordingAndActionProps) => {
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

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
    hasEnoughCredit,
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
    featureFlags: { enableBookingFreeOfferFifteenSixteen },
    storedProfileInfos,
  })
}
