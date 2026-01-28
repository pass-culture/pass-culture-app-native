import React, { ReactElement } from 'react'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { OfferModal } from 'shared/offer/enums'
import { useModal } from 'ui/components/modals/useModal'

export type OfferModalProps = {
  modalToDisplay?: OfferModal
  offerId: number
  isEndedUsedBooking?: boolean
  from: StepperOrigin
  bookingDataMovieScreening?: MovieScreeningBookingData
}

type Output = {
  OfferModal: ReactElement | null
  showModal: () => void
}

export const useBookOfferModal = ({
  modalToDisplay,
  offerId,
  isEndedUsedBooking,
  from,
  bookingDataMovieScreening,
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
            from={StepperOrigin.BOOKING}
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
            bookingDataMovieScreening={bookingDataMovieScreening}
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
        OfferModal: <FinishSubscriptionModal visible={visible} hideModal={hideModal} from={from} />,
        showModal,
      }

    default:
      return { OfferModal: null, showModal }
  }
}
