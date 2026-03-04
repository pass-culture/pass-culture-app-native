import { useRoute } from '@react-navigation/native'
import { useEffect } from 'react'

import {
  BookOfferResponse,
  EligibilityType,
  OfferResponse,
  RecommendationApiParams,
  YoungStatusType,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { Referrals, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsFreeOffer } from 'features/offer/helpers/getIsFreeOffer/getIsFreeOffer'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import { useHasEnoughCredit } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { getCTAWordingAndAction } from 'features/offerRefacto/helpers'
import { CTAContext } from 'features/offerRefacto/types'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Subcategory } from 'libs/subcategories/types'
import { useBookingsQuery, useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type UseGetCtaWordingAndActionProps = {
  offer: OfferResponse
  subcategory: Subcategory
  from?: Referrals
  searchId?: string
}

export const useCtaWordingAndAction = (props: UseGetCtaWordingAndActionProps) => {
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const storedProfileInfos = useStoredProfileInfos()

  const { offer, from, searchId, subcategory } = props
  const offerId = offer.id

  const { isLoggedIn, user } = useAuthContext()

  const hasEnoughCreditData = useHasEnoughCredit(offer)
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const { data: endedBooking } = useEndedBookingFromOfferIdQuery(offerId, false)
  const route = useRoute<UseRouteType<'Offer'>>()
  const apiRecoParams: RecommendationApiParams = route.params.apiRecoParams
    ? JSON.parse(route.params.apiRecoParams)
    : undefined
  const playlistType = route.params.playlistType
  const fromOfferId = route.params.fromOfferId
  const fromMultivenueOfferId = route.params.fromMultivenueOfferId

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
  const { bookedOffers = {}, status } = user ?? {}
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

  const context: CTAContext = {
    offer,
    isUnderageBeneficiary,
    bookOffer,
    booking,
    isBookingLoading,
    from,
    searchId,
    apiRecoParams,
    playlistType,
    subscriptionStatus: userStatus.subscriptionStatus,
    hasEnoughCreditMessage: hasEnoughCreditData.message,
    storedProfileInfos,
    alreadyBookedOfferId: user?.bookedOffers[offer.id],
  }

  return getCTAWordingAndAction({
    context,
    enableBookingFreeOfferFifteenSixteen,
    userStatus,
    hasEnoughCredit: hasEnoughCreditData.hasEnoughCredit,
    isLoggedIn,
    subcategory,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    user,
  })
}
