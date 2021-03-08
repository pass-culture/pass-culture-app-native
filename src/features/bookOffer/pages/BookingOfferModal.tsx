import React, { useEffect } from 'react'

import { useOffer } from 'features/offer/api/useOffer'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

import { useModalContent } from '../services/useModalContent'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerId: number
}

export const BookingOfferModalComponent: React.FC<Props> = ({ visible, dismissModal, offerId }) => {
  const { dispatch } = useBooking()
  const { title, leftIcon, onLeftIconPress, children } = useModalContent(dismissModal)
  const { data: offer } = useOffer({ offerId })

  const onPressRightIcon = () => {
    dismissModal()
    dispatch({ type: 'INIT', payload: {} })
  }
  useEffect(() => {
    dispatch({ type: 'INIT', payload: { offerId } })
  }, [])

  useEffect(() => {
    // This is temporary so that a stock is selected.
    if (offer && offer.stocks[0] && typeof offer.stocks[0].id === 'number') {
      dispatch({ type: 'SELECT_STOCK', payload: offer.stocks[0].id })
    }
  }, [offer])

  return (
    <AppModal
      visible={visible}
      title={title}
      leftIcon={leftIcon}
      onLeftIconPress={onLeftIconPress}
      rightIcon={Close}
      onRightIconPress={onPressRightIcon}>
      {children}
    </AppModal>
  )
}

export const BookingOfferModal: React.FC<Props> = (props) => (
  <BookingWrapper>
    <BookingOfferModalComponent {...props} />
  </BookingWrapper>
)
