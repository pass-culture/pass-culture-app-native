import React, { ReactElement } from 'react'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { OfferModal } from 'features/offer/enums'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { From } from 'shared/offer/components/AuthenticationModal/fromEnum'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { useModal } from 'ui/components/modals/useModal'

export type OfferModalProps = {
  modalToDisplay?: OfferModal
  offerId: number
  isEndedUsedBooking?: boolean
}

type Output = {
  OfferModal: ReactElement | null
  showModal: () => void
}

export const useBookOfferModal = ({
  modalToDisplay,
  offerId,
  isEndedUsedBooking,
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
          <AuthenticationModal
            visible={visible}
            hideModal={hideModal}
            offerId={offerId}
            from={From.BOOKING}
          />
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
          />
        ),
        showModal,
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
      return { OfferModal: null, showModal }
  }
}
