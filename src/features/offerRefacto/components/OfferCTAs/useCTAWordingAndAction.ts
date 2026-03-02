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
  OfferResponse,
  RecommendationApiParams,
  SubcategoryIdEnum,
  YoungStatusResponse,
  YoungStatusType,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import {
  useStoredProfileInfos,
  ValidStoredProfileInfos,
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
  HasEnoughCredit,
  useHasEnoughCredit,
} from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { getCTAProps } from 'features/offerRefacto/helpers/offerCTA'
import { CTAContext } from 'features/offerRefacto/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Subcategory } from 'libs/subcategories/types'
import { useBookingsQuery, useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { OfferModal } from 'shared/offer/enums'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type UseGetCtaWordingAndActionProps = {
  offer: OfferResponse
  subcategory: Subcategory
  from?: Referrals
  searchId?: string
}

const getIsBookedOffer = (
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponseWithoutSurvey['bookedOffers'] = {}
): boolean => bookedOffersIds[offerId] !== undefined

type Props = {
  isLoggedIn: boolean
  user?: UserProfileResponseWithoutSurvey
  userStatus: YoungStatusResponse
  isBeneficiary: boolean
  offer: OfferResponse
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
}: Props): ICTAWordingAndAction | undefined => {
  const { externalTicketOfficeUrl, subcategoryId, isDigital } = offer

  const isAlreadyBookedOffer = getIsBookedOffer(offer.id, user?.bookedOffers)
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const isMovieScreeningOffer = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const enableBookingFreeOfferFifteenSixteen = featureFlags.enableBookingFreeOfferFifteenSixteen
  const { hasEnoughCredit, message: hasEnoughCreditMessage } = hasEnoughCreditData

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

  const CTAContext: CTAContext = {
    offer,
    isUnderageBeneficiary,
    bookOffer,
    booking,
    isBookingLoading,
    isAlreadyBookedOffer,
    from,
    searchId,
    apiRecoParams,
    playlistType,
    subscriptionStatus: userStatus.subscriptionStatus,
    hasEnoughCreditMessage,
    storedProfileInfos,
    alreadyBookedOfferId: user?.bookedOffers[offer.id],
  }

  if (!isLoggedIn) {
    return getCTAProps(externalTicketOfficeUrl ? 'EXTERNAL_URL' : 'AUTHENTICATION', CTAContext)
  }

  if (shouldBeRedirectedToExternalUrl) {
    return getCTAProps('EXTERNAL_URL', CTAContext)
  }

  if (isEligibleFreeOffer15To16 && isNotFreeOffer) {
    return getCTAProps('USER_15_16', CTAContext)
  }

  if (isFreeDigitalOffer && userStatus?.statusType !== YoungStatusType.non_eligible) {
    if (subcategory.isEvent) {
      return getCTAProps(isAlreadyBookedOffer ? 'SEE_BOOKING' : 'BOOK_OFFER', CTAContext)
    }
    return getCTAProps('DIGITAL_OFFER', CTAContext)
  }

  if (isFreeOffer) {
    if (isEligibleFreeOffer15To16 && isProfileIncomplete) {
      return getCTAProps('INCOMPLETE_PROFILE', CTAContext)
    }
    if (!isProfileIncomplete) {
      // If the profile is complete we consider they can book a free offer
      return getCTAProps('BOOK_OFFER', CTAContext)
    }
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !externalTicketOfficeUrl) {
    return getCTAProps('INELIGIBLE', CTAContext)
  }

  if (isEndedUsedBooking) {
    return getCTAProps('ENDED_USED_BOOKING', CTAContext)
  }

  if (userStatus.statusType === YoungStatusType.eligible && !isBeneficiary) {
    return getCTAProps('SUBSCRIPTION_STATUS', CTAContext)
  }

  if (isAlreadyBookedOffer) {
    return getCTAProps('SEE_BOOKING', CTAContext)
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isLoggedIn || !isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return { wording: undefined }

    return getCTAProps('EXTERNAL_URL', CTAContext)
  }

  // Beneficiary
  if (isDepositExpired && isMovieScreeningOffer) return getCTAProps('EXPIRED_CREDIT', CTAContext)

  if (!offer.isReleased || offer.isExpired) return getCTAProps('EXPIRED_OFFER', CTAContext)
  if (offer.isSoldOut) return getCTAProps('SOLD_OUT_OFFER', CTAContext)

  if (!subcategory.isEvent) {
    return getCTAProps(hasEnoughCredit ? 'BOOK_OFFER' : 'INSUFFICIENT_CREDIT', CTAContext)
  }

  if (subcategory.isEvent) {
    return getCTAProps(hasEnoughCredit ? 'BOOK_EVENT_OFFER' : 'INSUFFICIENT_CREDIT', CTAContext)
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
  const { data: endedBooking } = useEndedBookingFromOfferIdQuery(offerId, false)
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
      void openUrl(booking.completedUrl ?? '')
    }
  }

  const { mutate: bookOffer, isPending: isBookingLoading } = useBookOfferMutation({
    onSuccess(data) {
      void analytics.logBookingConfirmation({
        ...apiRecoParams,
        offerId: offerId.toString(),
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
    featureFlags: { enableBookingFreeOfferFifteenSixteen },
    storedProfileInfos,
  })
}
