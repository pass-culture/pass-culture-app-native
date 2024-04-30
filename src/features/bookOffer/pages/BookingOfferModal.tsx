import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { isApiError } from 'api/apiHelpers'
import { CategoryIdEnum } from 'api/gen'
import { useBookOfferMutation } from 'features/bookOffer/api/useBookOfferMutation'
import { BookingCloseInformation } from 'features/bookOffer/components/BookingCloseInformation'
import { BookingOfferModalFooter } from 'features/bookOffer/components/BookingOfferModalFooter'
import { BookingOfferModalHeader } from 'features/bookOffer/components/BookingOfferModalHeader'
import { BookingWrapper } from 'features/bookOffer/context/BookingWrapper'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getStockWithCategory } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useModalContent } from 'features/bookOffer/helpers/useModalContent'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { useLogOfferConversion } from 'libs/algolia/analytics/logOfferConversion'
import { analytics } from 'libs/analytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { RecommendationApiParams } from 'shared/offer/types'
import { AppModal } from 'ui/components/modals/AppModal'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { BicolorNoBookings } from 'ui/svg/icons/BicolorNoBookings'
import { LINE_BREAK } from 'ui/theme/constants'
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
  PROVIDER_STOCK_SOLD_OUT: 'Oups, cette offre n’est plus disponible\u00a0!',
}

export const BookingOfferModalComponent: React.FC<BookingOfferModalComponentProps> = ({
  visible,
  offerId,
  isEndedUsedBooking,
  bookingDataMovieScreening,
}) => {
  const { data: offer } = useOffer({ offerId })
  const { dismissModal, dispatch, bookingState } = useBookingContext()
  const { step } = bookingState
  const { navigate } = useNavigation<UseNavigationType>()
  const { logOfferConversion } = useLogOfferConversion()
  const route = useRoute<UseRouteType<'Offer'>>()
  const selectedStock = useBookingStock()
  const { showErrorSnackBar } = useSnackBarContext()
  const [isBookingStopped, setIsBookingStopped] = useState(false)
  const isFromSearch = route.params?.from === 'search'
  const fromOfferId = route.params?.fromOfferId
  const fromMultivenueOfferId = route.params?.fromMultivenueOfferId
  const algoliaOfferId = offerId?.toString()
  const apiRecoParams: RecommendationApiParams = route.params?.apiRecoParams
    ? JSON.parse(route.params?.apiRecoParams)
    : undefined
  const playlistType = route.params?.playlistType

  const enableMusicLiveBookingSurvey = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_MUSIC_LIVE_BOOKING_SURVEY
  )

  const onBookOfferSuccess = useCallback(
    ({ bookingId }: { bookingId: number }) => {
      dismissModal()

      if (offerId) {
        analytics.logBookingConfirmation({
          ...apiRecoParams,
          offerId,
          bookingId,
          fromOfferId: fromMultivenueOfferId ? undefined : fromOfferId,
          fromMultivenueOfferId,
          playlistType,
        })
        if (isFromSearch && algoliaOfferId) {
          logOfferConversion(algoliaOfferId)
        }

        if (!!selectedStock && !!offer?.subcategoryId) {
          campaignTracker.logEvent(CampaignEvents.COMPLETE_BOOK_OFFER, {
            af_offer_id: offerId,
            af_booking_id: selectedStock.id,
            af_price: selectedStock.price,
            af_category: offer.subcategoryId,
          })
        }
        navigate('BookingConfirmation', { offerId, bookingId })
      }
    },
    [
      dismissModal,
      offerId,
      apiRecoParams,
      fromOfferId,
      fromMultivenueOfferId,
      playlistType,
      isFromSearch,
      algoliaOfferId,
      selectedStock,
      offer?.subcategoryId,
      navigate,
      logOfferConversion,
    ]
  )

  const onBookOfferError = useCallback(
    (error?: ApiError | Error) => {
      dismissModal()
      let message = 'En raison d’une erreur technique, l’offre n’a pas pu être réservée'

      if (isApiError(error)) {
        const { content } = error as { content: { code: string } }

        if (content?.code in errorCodeToMessage) {
          // @ts-expect-error: because of noUncheckedIndexedAccess
          message = errorCodeToMessage[content.code]

          if (typeof offerId === 'number') {
            analytics.logBookingError(offerId, content.code)
          }
        }
      }
      showErrorSnackBar({ message, timeout: SNACK_BAR_TIME_OUT })
    },
    [dismissModal, offerId, showErrorSnackBar]
  )

  const { mutate, isLoading } = useBookOfferMutation({
    onSuccess: onBookOfferSuccess,
    onError: onBookOfferError,
  })

  const onPressBookOffer = () => {
    if (bookingState.quantity && bookingState.stockId) {
      mutate({ quantity: bookingState.quantity, stockId: bookingState.stockId })
    }
  }

  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent(onPressBookOffer, isLoading, isEndedUsedBooking, bookingDataMovieScreening)

  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()

  const stocksWithCategory = useMemo(() => {
    return getStockWithCategory(offer?.stocks, bookingState.date, bookingState.hour)
  }, [bookingState.date, bookingState.hour, offer?.stocks])
  const hasPricesStep = stocksWithCategory.length > 1

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
      analytics.logClickBookOffer({ offerId })
    }
  }, [visible, offerId])

  const shouldAddSpacerBetweenHeaderAndContent = step === Step.CONFIRMATION

  const {
    visible: bookingCloseInformationModalVisible,
    showModal: showBookingCloseInformationModal,
    hideModal: hideBookingCloseInformationModal,
  } = useModal(false)

  const mapping = useSubcategoriesMapping()
  const subcategory = offer && mapping[offer?.subcategoryId]
  const isMusicLiveCategory = subcategory?.categoryId === CategoryIdEnum.MUSIQUE_LIVE

  const shouldDisplaySurveyModal =
    isMusicLiveCategory && isBookingStopped && enableMusicLiveBookingSurvey

  const onClose = useCallback(async () => {
    dismissModal()

    if (isMusicLiveCategory) {
      const musicLiveSurveyHasBeenDisplayed = await storage.readObject(
        'times_music_live_booking_survey_has_been_displayed'
      )
      if (!musicLiveSurveyHasBeenDisplayed) {
        setIsBookingStopped(true)
      }
    }
    if (bookingState.offerId !== offerId) dispatch({ type: 'SET_OFFER_ID', payload: offerId })
    dispatch({ type: 'RESET' })
    if (isLoading && title.includes('Détails de la réservation')) {
      showBookingCloseInformationModal()
    }
    analytics.logCancelBookingFunnel(step, offerId)
  }, [
    dismissModal,
    isMusicLiveCategory,
    bookingState.offerId,
    offerId,
    dispatch,
    isLoading,
    title,
    step,
    showBookingCloseInformationModal,
  ])

  const closeSurveyModal = async () => {
    await storage.saveString('times_music_live_booking_survey_has_been_displayed', String('1'))
    setIsBookingStopped(false)
  }

  return shouldDisplaySurveyModal ? (
    <SurveyModal
      title="Cette offre ne t’intéresse plus&nbsp;?"
      visible
      hideModal={closeSurveyModal}
      surveyUrl="https://passculture.qualtrics.com/jfe/form/SV_9z66yFGnrB65nWC"
      surveyDescription={DescriptionMusicLiveBookingSurvey}
      Icon={IconMusicLiveBookingSurvey}
    />
  ) : (
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

const DescriptionMusicLiveBookingSurvey = `Tu peux nous dire pourquoi en répondant au questionnaire.${LINE_BREAK}${LINE_BREAK}Il te prendra 1 petite minute!`

const IconMusicLiveBookingSurvey = styled(BicolorNoBookings).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
