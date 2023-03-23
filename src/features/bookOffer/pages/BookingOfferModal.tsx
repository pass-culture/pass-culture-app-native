import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { isApiError } from 'api/apiHelpers'
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
import { useLogOfferConversion } from 'libs/algolia/analytics/logOfferConversion'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  visible: boolean
  offerId: number
  isEndedUsedBooking?: boolean
}

export const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT:
    'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!',
  ALREADY_BOOKED: 'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!',
  STOCK_NOT_BOOKABLE: 'Oups, cette offre n’est plus disponible\u00a0!',
}

export const BookingOfferModalComponent: React.FC<Props> = ({
  visible,
  offerId,
  isEndedUsedBooking,
}) => {
  const { dismissModal, dispatch, bookingState } = useBookingContext()
  const { step } = bookingState
  const { navigate } = useNavigation<UseNavigationType>()
  const { logOfferConversion } = useLogOfferConversion()
  const route = useRoute<UseRouteType<'Offer'>>()
  const selectedStock = useBookingStock()
  const { showErrorSnackBar } = useSnackBarContext()

  const isFromSearch = route.params?.from === 'search'
  const fromOfferId = route.params?.fromOfferId
  const algoliaOfferId = offerId?.toString()

  const { mutate, isLoading } = useBookOfferMutation({
    onSuccess: ({ bookingId }) => {
      dismissModal()
      if (offerId) {
        analytics.logBookingConfirmation(offerId, bookingId, fromOfferId)
        isFromSearch && algoliaOfferId && logOfferConversion(algoliaOfferId)

        if (!!selectedStock && !!offer)
          campaignTracker.logEvent(CampaignEvents.COMPLETE_BOOK_OFFER, {
            af_offer_id: offer.id,
            af_booking_id: selectedStock.id,
            af_price: selectedStock.price,
            af_category: offer.subcategoryId,
          })
        navigate('BookingConfirmation', { offerId, bookingId })
      }
    },
    onError: (error) => {
      dismissModal()
      let message = 'En raison d’une erreur technique, l’offre n’a pas pu être réservée'

      if (isApiError(error)) {
        const { content } = error as { content: { code: string } }
        if (content && content.code && content.code in errorCodeToMessage) {
          message = errorCodeToMessage[content.code]
          if (typeof offerId === 'number') {
            analytics.logBookingError(offerId, content.code)
          }
        }
      }

      showErrorSnackBar({ message, timeout: SNACK_BAR_TIME_OUT })
    },
  })

  const onPressBookOffer = () => {
    if (bookingState.quantity && bookingState.stockId) {
      mutate({ quantity: bookingState.quantity, stockId: bookingState.stockId })
    }
  }

  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent(onPressBookOffer, isLoading, isEndedUsedBooking)
  const enablePricesByCategories = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES)

  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()

  const { data: offer } = useOffer({ offerId })

  const stocksWithCategory = useMemo(() => {
    return getStockWithCategory(offer?.stocks, bookingState.date, bookingState.hour)
  }, [bookingState.date, bookingState.hour, offer?.stocks])
  const hasPricesStep = enablePricesByCategories && Boolean(stocksWithCategory.length > 1)

  const modalLeftIconProps = {
    leftIcon,
    leftIconAccessibilityLabel,
    onLeftIconPress,
  } as ModalLeftIconProps

  useEffect(() => {
    dispatch({ type: 'SET_OFFER_ID', payload: offerId })
  }, [offerId, dispatch])

  useEffect(() => {
    if (visible) {
      analytics.logBookingProcessStart(offerId)
    }
  }, [visible, offerId])

  const shouldAddSpacerBetweenHeaderAndContent =
    !enablePricesByCategories || (enablePricesByCategories && step === Step.CONFIRMATION)

  const {
    visible: bookingCloseInformationModalVisible,
    showModal: showBookingCloseInformationModalVisible,
    hideModal: hideBookingCloseInformationModalVisible,
  } = useModal(false)

  const onClose = useCallback(() => {
    dismissModal()
    dispatch({ type: 'RESET' })
    if (isLoading && title.includes('Détails de la réservation')) {
      showBookingCloseInformationModalVisible()
    }
    if (enablePricesByCategories) analytics.logCancelBookingFunnel(step, offerId)
  }, [
    dismissModal,
    dispatch,
    enablePricesByCategories,
    offerId,
    step,
    isLoading,
    title,
    showBookingCloseInformationModalVisible,
  ])

  return enablePricesByCategories ? (
    <React.Fragment>
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
            isEndedUsedBooking={isEndedUsedBooking}
          />
        }
        fixedModalBottom={
          <BookingOfferModalFooter hasPricesStep={hasPricesStep} isDuo={offer?.isDuo} />
        }
        shouldAddSpacerBetweenHeaderAndContent={shouldAddSpacerBetweenHeaderAndContent}>
        {children}
      </AppModal>
      <BookingCloseInformation
        visible={bookingCloseInformationModalVisible}
        hideModal={hideBookingCloseInformationModalVisible}
      />
    </React.Fragment>
  ) : (
    <AppModal
      testID="modalWithoutPricesByCategories"
      animationOutTiming={1}
      visible={visible}
      title={title}
      {...modalLeftIconProps}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={onClose}
      shouldAddSpacerBetweenHeaderAndContent={shouldAddSpacerBetweenHeaderAndContent}>
      {children}
    </AppModal>
  )
}

export const BookingOfferModal: React.FC<Props & { dismissModal: () => void }> = ({
  dismissModal,
  ...props
}) => (
  <BookingWrapper dismissModal={dismissModal}>
    <BookingOfferModalComponent {...props} />
  </BookingWrapper>
)
