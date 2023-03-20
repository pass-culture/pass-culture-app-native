import React, { useCallback, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { BookingOfferModalFooter } from 'features/bookOffer/components/BookingOfferModalFooter'
import { BookingOfferModalHeader } from 'features/bookOffer/components/BookingOfferModalHeader'
import { BookingWrapper } from 'features/bookOffer/context/BookingWrapper'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useModalContent } from 'features/bookOffer/helpers/useModalContent'
import { useOffer } from 'features/offer/api/useOffer'
import { analytics } from 'libs/firebase/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  visible: boolean
  offerId: number
  isEndedUsedBooking?: boolean
}

export const BookingOfferModalComponent: React.FC<Props> = ({
  visible,
  offerId,
  isEndedUsedBooking,
}) => {
  const { dismissModal, dispatch, bookingState } = useBookingContext()
  const { step } = bookingState
  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent(isEndedUsedBooking)
  const enablePricesByCategories = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES)

  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()

  const { data: offer } = useOffer({ offerId })
  const stocksWithCategory =
    offer?.stocks?.filter((stock) => !stock.isExpired && stock.priceCategoryLabel) || []
  const hasPricesStep = Boolean(stocksWithCategory.length > 1)

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

  const onClose = useCallback(() => {
    dismissModal()
    dispatch({ type: 'RESET' })
    if (enablePricesByCategories) analytics.logCancelBookingFunnel(step, offerId)
  }, [dismissModal, dispatch, enablePricesByCategories, offerId, step])

  return enablePricesByCategories ? (
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
