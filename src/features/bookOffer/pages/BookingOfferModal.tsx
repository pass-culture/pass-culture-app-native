import React, { useEffect } from 'react'

import { analytics } from 'libs/firebase/analytics'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'

import { useModalContent } from '../services/useModalContent'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  offerId: number
  isEndedUsedBooking?: boolean
  fromOfferId?: number
}

export const BookingOfferModalComponent: React.FC<Props> = ({
  visible,
  offerId,
  isEndedUsedBooking,
  fromOfferId,
}) => {
  const { dismissModal, dispatch } = useBooking()
  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent(isEndedUsedBooking, fromOfferId)

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

  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title={title}
      {...modalLeftIconProps}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={() => {
        dismissModal()
        dispatch({ type: 'RESET' })
      }}>
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
