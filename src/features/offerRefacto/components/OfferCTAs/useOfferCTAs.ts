import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'
import { useTheme } from 'styled-components/native'

import { BookOfferResponse, EligibilityType, OfferResponse, YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { openUrl } from 'features/navigation/helpers/openUrl'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/RootNavigator/types'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsProfileIncomplete } from 'features/offer/helpers/getIsProfileIncomplete/getIsProfileIncomplete'
import { useHasEnoughCredit } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'
import { useAddReminderMutation } from 'features/offer/queries/useAddReminderMutation'
import { useDeleteReminderMutation } from 'features/offer/queries/useDeleteReminderMutation'
import { useGetRemindersQuery } from 'features/offer/queries/useGetRemindersQuery'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import {
  getCTAWordingAndAction,
  getIsAComingSoonOffer,
  isFreeDigitalOffer,
  isFreeOffer,
} from 'features/offerRefacto/helpers'
import { CTAContext, FavoriteCTAProps, OfferCTAsViewModel } from 'features/offerRefacto/types'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { Subcategory } from 'libs/subcategories/types'
import { useBookingsQuery, useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { useModal } from 'ui/components/modals/useModal'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type UseOfferCTAsParams = {
  offer: OfferResponse
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
  favoriteCTAProps: FavoriteCTAProps
}

export const useOfferCTAs = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
  favoriteCTAProps,
}: UseOfferCTAsParams): OfferCTAsViewModel | undefined => {
  const theme = useTheme()
  const { isMobileViewport } = theme
  const { setParams } = useNavigation<UseNavigationType>()
  const route = useRoute<UseRouteType<'Offer'>>()
  const { isLoggedIn, user } = useAuthContext()
  const { addFavorite, removeFavorite, favorite } = favoriteCTAProps
  const offerId = offer.id

  // 1. Params & config
  const {
    from,
    searchId,
    openModalOnNavigation,
    playlistType,
    fromOfferId,
    fromMultivenueOfferId,
  } = route.params ?? {}
  const apiRecoParams = route.params?.apiRecoParams
    ? JSON.parse(route.params.apiRecoParams)
    : undefined

  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )
  const {
    data: { showAccessScreeningButton },
  } = useRemoteConfigQuery()
  const { isButtonVisible: isCineButtonVisible } = useOfferCTA()

  // 2. Queries (Bookings, Reminders, Credits)
  const { refetch: getBookings } = useBookingsQuery()
  const { data: endedBooking } = useEndedBookingFromOfferIdQuery(offerId, false)
  const { bookedOffers = {}, status } = user ?? {}
  const { data: ongoingBooking } = useOngoingOrEndedBookingQuery(
    getBookingOfferId(offerId, bookedOffers) ?? 0
  )
  const { data: reminder } = useGetRemindersQuery((data) => selectReminderByOfferId(data, offer.id))
  const hasEnoughCreditData = useHasEnoughCredit(offer)
  const storedProfileInfos = useStoredProfileInfos()

  // 3. Mutations (Booking & Reminders)
  const redirectToBookingAction = useCallback(
    async (response: BookOfferResponse) => {
      const bookings = await getBookings()
      const booking = bookings.data?.ongoing_bookings.find(
        (booking) => booking.id === response.bookingId
      )
      if (booking) void openUrl(booking.completedUrl ?? '')
    },
    [getBookings]
  )

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

  const { mutate: addReminder } = useAddReminderMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas pu être ajoutée à tes rappels')
    },
  })
  const { mutate: deleteReminder } = useDeleteReminderMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas pu être retirée de tes rappels')
    },
  })

  // 4. Logic & wording
  const userStatus = status?.statusType ? status : { statusType: YoungStatusType.non_eligible }

  const context: CTAContext = {
    offer,
    isUnderageBeneficiary: isUserUnderageBeneficiary(user),
    bookOffer,
    booking: ongoingBooking,
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

  const ctaConfig = getCTAWordingAndAction({
    context,
    enableBookingFreeOfferFifteenSixteen,
    userStatus,
    hasEnoughCredit: hasEnoughCreditData.hasEnoughCredit,
    isLoggedIn,
    subcategory,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    user,
  })
  const { modalToDisplay, onPress } = ctaConfig

  // 5. Modals & handlers
  const favoriteAuthModal = useModal(false)
  const reminderAuthModal = useModal(false)
  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    from: StepperOrigin.OFFER,
  })

  const isAComingSoonOffer = getIsAComingSoonOffer(offer.bookingAllowedDatetime)
  const showCineCTA = isMobileViewport && showAccessScreeningButton && isCineButtonVisible

  const handleOnPress = useCallback(() => {
    onPress?.()
    if (modalToDisplay) showOfferModal()
  }, [modalToDisplay, onPress, showOfferModal])

  const handleOnFavoritePress = useCallback(() => {
    if (!isLoggedIn) return favoriteAuthModal.showModal()
    return favorite ? removeFavorite(favorite.id) : addFavorite({ offerId })
  }, [addFavorite, favorite, favoriteAuthModal, isLoggedIn, offerId, removeFavorite])

  const handleOnReminderPress = useCallback(() => {
    if (!isLoggedIn) return reminderAuthModal.showModal()
    return reminder ? deleteReminder(reminder.id) : addReminder(offerId)
  }, [addReminder, deleteReminder, isLoggedIn, offerId, reminder, reminderAuthModal])

  // 6. Effects
  useEffect(() => {
    const isUserFreeStatus = user?.eligibility === EligibilityType.free
    const isProfileIncomplete = getIsProfileIncomplete(user)
    const isEligibleFreeOffer15To16 = enableBookingFreeOfferFifteenSixteen && isUserFreeStatus

    if (isLoggedIn && isEligibleFreeOffer15To16 && isProfileIncomplete && isFreeOffer(offer)) {
      freeOfferIdActions.setFreeOfferId(offer.id)
    }
  }, [isLoggedIn, enableBookingFreeOfferFifteenSixteen, user, offer])

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (openModalOnNavigation) {
        showOfferModal()
        setParams({ openModalOnNavigation: undefined })
      }
    }, [trackEventHasSeenOfferOnce, openModalOnNavigation, showOfferModal, setParams])
  )

  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   * The venue.id is not available on Homepage, or wherever we click on an offer
   * and preload the Offer details page. As a result, checking that venue.id
   * exists is equivalent to making sure the API call is successful.
   */
  if (isLoggedIn === null || user === null || !offer.venue.id) return

  return {
    ctaProps: {
      ...ctaConfig,
      onPress: handleOnPress,
      onFavoritePress: handleOnFavoritePress,
      onReminderPress: handleOnReminderPress,
    },
    CTAOfferModal,
    theme,
    isFreeDigitalOffer: isFreeDigitalOffer(offer),
    isAComingSoonOffer,
    isLoggedIn,
    showCineCTA,
    hasReminder: !!reminder,
    favoriteAuthModal,
    reminderAuthModal,
  }
}
