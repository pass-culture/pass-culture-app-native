import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { isApiError } from 'api/apiHelpers'
import { RecommendationApiParams, SubcategoryIdEnum } from 'api/gen'
import { BookingCloseInformation } from 'features/bookOffer/components/BookingCloseInformation'
import { BookingOfferModalFooter } from 'features/bookOffer/components/BookingOfferModalFooter'
import { BookingOfferModalHeader } from 'features/bookOffer/components/BookingOfferModalHeader'
import { BookingWrapper } from 'features/bookOffer/context/BookingWrapper'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { shouldDisplayPricesStep } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useModalContent } from 'features/bookOffer/helpers/useModalContent'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { logOfferConversion } from 'libs/algolia/analytics/logOfferConversion'
import { algoliaAnalyticsSelectors } from 'libs/algolia/store/algoliaAnalyticsStore'
import { analytics } from 'libs/analytics/provider'
import { CampaignEvents, campaignTracker } from 'libs/campaign/campaign'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface BookingOfferModalComponentProps {
  visible: boolean
  offerId: number
  isEndedUsedBooking?: boolean
  bookingDataMovieScreening?: MovieScreeningBookingData
}

const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT:
    'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!',
  ALREADY_BOOKED: 'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!',
  STOCK_NOT_BOOKABLE: 'Oups, cette offre n’est plus disponible\u00a0!',
  PROVIDER_STOCK_NOT_ENOUGH_SEATS: 'Désolé, il n’y a plus de place pour cette séance\u00a0!',
  PROVIDER_BOOKING_TIMEOUT: 'Nous t’invitons à réessayer un peu plus tard',
  PROVIDER_SHOW_DOES_NOT_EXIST: 'Oups, cette offre n’est plus disponible\u00a0!',
}

export const BookingOfferModalComponent: React.FC<BookingOfferModalComponentProps> = ({
  visible,
  offerId,
  isEndedUsedBooking,
  bookingDataMovieScreening,
}) => {
  const { data: offer } = useOfferQuery({ offerId })
  const { dismissModal, dispatch, bookingState } = useBookingContext()
  const { step } = bookingState
  const { navigate } = useNavigation<UseNavigationType>()
  const route = useRoute<UseRouteType<'Offer'>>()
  const selectedStock = useBookingStock()
  const { showErrorSnackBar } = useSnackBarContext()
  const isFromSearch = route.params?.from === 'searchresults'
  const fromOfferId = route.params?.fromOfferId
  const fromMultivenueOfferId = route.params?.fromMultivenueOfferId
  const algoliaOfferId = offerId?.toString()
  const apiRecoParams: RecommendationApiParams = route.params?.apiRecoParams
    ? JSON.parse(route.params?.apiRecoParams)
    : undefined
  const playlistType = route.params?.playlistType

  const onBookOfferSuccess = ({ bookingId }: { bookingId: number }) => {
    dismissModal()

    if (offerId) {
      void analytics.logBookingConfirmation({
        ...apiRecoParams,
        offerId: offerId.toString(),
        bookingId: bookingId.toString(),
        fromOfferId: fromMultivenueOfferId ? undefined : fromOfferId?.toString(),
        fromMultivenueOfferId: fromMultivenueOfferId?.toString(),
        playlistType,
      })
      if (isFromSearch && algoliaOfferId) {
        const currentQueryID = algoliaAnalyticsSelectors.selectCurrentQueryID()
        void logOfferConversion({ objectID: algoliaOfferId, queryID: currentQueryID })
      }
      if (offer?.subcategoryId === SubcategoryIdEnum.SEANCE_CINE) {
        void analytics.logHasBookedCineScreeningOffer({
          offerId,
        })
      }
      if (!!selectedStock && !!offer?.subcategoryId) {
        void campaignTracker.logEvent(CampaignEvents.COMPLETE_BOOK_OFFER, {
          af_offer_id: offerId,
          af_booking_id: selectedStock.id,
          af_price: selectedStock.price,
          af_category: offer.subcategoryId,
        })
      }
      runAfterInteractionsMobile(() => {
        navigate('BookingConfirmation', { offerId, bookingId })
      })
    }
  }

  const onBookOfferError = useCallback(
    (error?: ApiError | Error) => {
      dismissModal()
      let message = 'En raison d’une erreur technique, l’offre n’a pas pu être réservée'

      if (isApiError(error)) {
        const { content } = error as { content: { code: string } }
        const errorMessage = errorCodeToMessage[content?.code]
        if (errorMessage) {
          message = errorMessage
          if (typeof offerId === 'number') {
            void analytics.logBookingError(offerId, content.code)
          }
        }
      }
      showErrorSnackBar({ message, timeout: SNACK_BAR_TIME_OUT })
    },
    [dismissModal, offerId, showErrorSnackBar]
  )

  const { mutate, isPending } = useBookOfferMutation({
    onSuccess: onBookOfferSuccess,
    onError: onBookOfferError,
  })

  const onPressBookOffer = () => {
    if (bookingState.quantity && bookingState.stockId) {
      mutate({ quantity: bookingState.quantity, stockId: bookingState.stockId })
    }
  }

  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent(onPressBookOffer, isPending, isEndedUsedBooking, bookingDataMovieScreening)

  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()

  const hasPricesStep = shouldDisplayPricesStep(
    offer?.stocks,
    bookingState.date,
    bookingState.hour,
    offer?.isEvent
  )

  const modalLeftIconProps = {
    leftIcon,
    leftIconAccessibilityLabel,
    onLeftIconPress,
  } as ModalLeftIconProps

  useEffect(() => {
    dispatch({ type: 'SET_OFFER_ID', payload: offerId })
    if (!bookingDataMovieScreening) {
      return
    }
    dispatch({
      type: 'SELECT_DATE',
      payload: bookingDataMovieScreening.date,
    })
    dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
    dispatch({ type: 'SELECT_STOCK', payload: bookingDataMovieScreening.stockId })
  }, [offerId, dispatch, bookingDataMovieScreening])

  useEffect(() => {
    if (visible) {
      void analytics.logClickBookOffer({ offerId })
    }
  }, [visible, offerId])

  const shouldAddSpacerBetweenHeaderAndContent = step === Step.CONFIRMATION

  const {
    visible: bookingCloseInformationModalVisible,
    showModal: showBookingCloseInformationModal,
    hideModal: hideBookingCloseInformationModal,
  } = useModal(false)

  const onClose = useCallback(async () => {
    dismissModal()

    if (bookingState.offerId !== offerId) dispatch({ type: 'SET_OFFER_ID', payload: offerId })
    dispatch({ type: 'RESET' })
    if (isPending && title.includes('Détails de la réservation')) {
      showBookingCloseInformationModal()
    }
    void analytics.logCancelBookingFunnel(step, offerId)
  }, [
    dismissModal,
    bookingState.offerId,
    offerId,
    dispatch,
    isPending,
    title,
    step,
    showBookingCloseInformationModal,
  ])

  return (
    <AppModal
      testID="modalWithPricesByCategories"
      noPadding
      visible={visible}
      title={title}
      maxHeight={height - top}
      modalSpacing={modal.spacing.MD}
      customModalHeader={
        <BookingOfferModalHeader
          onClose={onClose}
          modalLeftIconProps={modalLeftIconProps}
          title={title}
        />
      }
      fixedModalBottom={
        <BookingOfferModalFooter hasPricesStep={hasPricesStep} isDuo={offer?.isDuo} />
      }
      shouldAddSpacerBetweenHeaderAndContent={shouldAddSpacerBetweenHeaderAndContent}>
      {children}
      <BookingCloseInformation
        visible={bookingCloseInformationModalVisible}
        hideModal={hideBookingCloseInformationModal}
      />
    </AppModal>
  )
}

export const BookingOfferModal: React.FC<
  BookingOfferModalComponentProps & { dismissModal: () => void }
> = ({ dismissModal, ...props }) => (
  <BookingWrapper dismissModal={dismissModal}>
    <BookingOfferModalComponent {...props} />
  </BookingWrapper>
)
