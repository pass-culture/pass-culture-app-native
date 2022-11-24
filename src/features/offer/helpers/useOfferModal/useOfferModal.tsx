import React, { ReactElement } from 'react'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { ApplicationProcessingModal } from 'features/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'features/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'features/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'features/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { OfferModal } from 'features/offer/enums'
import { useModal } from 'ui/components/modals/useModal'

export type OfferModalProps = {
  modalToDisplay?: OfferModal
  offerId: number
  isEndedUsedBooking?: boolean
  fromOfferId?: number
}

type Output = {
  OfferModal: ReactElement | null
  showModal?: () => void
  dismissBookingOfferModal?: () => void
}

export const useOfferModal = ({
  modalToDisplay,
  offerId,
  isEndedUsedBooking,
  fromOfferId,
}: OfferModalProps): Output => {
  const { visible, showModal, hideModal } = useModal(false)

  switch (modalToDisplay) {
    case OfferModal.APPLICATION_PROCESSING:
      return {
        OfferModal: (
          <ApplicationProcessingModal visible={visible} hideModal={hideModal} offerId={offerId} />
        ),
        showModal,
      }

    case OfferModal.AUTHENTICATION:
      return {
        OfferModal: (
          <AuthenticationModal visible={visible} hideModal={hideModal} offerId={offerId} />
        ),
        showModal,
      }

    case OfferModal.BOOKING:
      return {
        OfferModal: (
          <BookingOfferModal
            visible={visible}
            dismissModal={hideModal}
            offerId={offerId}
            isEndedUsedBooking={isEndedUsedBooking}
            fromOfferId={fromOfferId}
          />
        ),
        showModal,
        dismissBookingOfferModal: hideModal,
      }

    case OfferModal.ERROR_APPLICATION:
      return {
        OfferModal: (
          <ErrorApplicationModal visible={visible} hideModal={hideModal} offerId={offerId} />
        ),
        showModal,
      }

    case OfferModal.FINISH_SUBSCRIPTION:
      return {
        OfferModal: (
          <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
        ),
        showModal,
      }

    default:
      return { OfferModal: null }
  }
}
