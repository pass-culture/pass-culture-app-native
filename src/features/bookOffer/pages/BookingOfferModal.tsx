import React, { useEffect } from 'react'

import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

import { useModalContent } from '../services/useModalContent'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  offerId: number
}

export const BookingOfferModalComponent: React.FC<Props> = ({ visible, offerId }) => {
  const { dismissModal, dispatch } = useBooking()
  const { title, leftIcon, onLeftIconPress, children } = useModalContent()

  useEffect(() => {
    dispatch({ type: 'SET_OFFER_ID', payload: offerId })
  }, [])

  const onPressRightIcon = () => {
    dismissModal()
    dispatch({ type: 'RESET' })
  }

  return (
    <AppModal
      visible={visible}
      title={title}
      leftIcon={leftIcon}
      onLeftIconPress={onLeftIconPress}
      rightIcon={Close}
      onRightIconPress={onPressRightIcon}
      isScrollable>
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
