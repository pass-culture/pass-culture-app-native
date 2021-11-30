import { t } from '@lingui/macro'
import React, { useEffect } from 'react'

import { analytics } from 'libs/analytics'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'

import { useModalContent } from '../services/useModalContent'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  offerId: number
}

export const BookingOfferModalComponent: React.FC<Props> = ({ visible, offerId }) => {
  const { dismissModal, dispatch } = useBooking()
  const { title, leftIconAccessibilityLabel, leftIcon, onLeftIconPress, children } =
    useModalContent()

  const modalLeftIconProps = {
    leftIcon,
    leftIconAccessibilityLabel,
    onLeftIconPress,
  } as ModalLeftIconProps

  useEffect(() => {
    dispatch({ type: 'SET_OFFER_ID', payload: offerId })
  }, [])

  useEffect(() => {
    if (visible) {
      analytics.logBookingProcessStart(offerId)
    }
  }, [visible])

  return (
    <AppModal
      visible={visible}
      title={title}
      {...modalLeftIconProps}
      rightIconAccessibilityLabel={t`Fermer la modale`}
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
