import React, { useEffect } from 'react'

import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

import { useModalContent } from '../services/useModalContent'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerId: number
}

const BookingOfferModalComponent: React.FC<Props> = ({ visible, dismissModal, offerId }) => {
  const { dispatch } = useBooking()
  const { title, leftIcon, onLeftIconPress, children } = useModalContent(dismissModal)

  useEffect(() => {
    dispatch({ type: 'INIT', payload: { offerId } })
  }, [])

  return (
    <AppModal
      visible={visible}
      title={title}
      leftIcon={leftIcon}
      onLeftIconPress={onLeftIconPress}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      {children}
    </AppModal>
  )
}

export const BookingOfferModal: React.FC<Props> = (props) => (
  <BookingWrapper>
    <BookingOfferModalComponent {...props} />
  </BookingWrapper>
)
