import React from 'react'

import { Bookability, Screening } from 'api/gen'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { ModalSettings } from 'ui/components/modals/useModal'

type BookOfferModalProps = {
  screening?: Screening
  offerId: number
  modalSettings: ModalSettings
  from: StepperOrigin
}

const screeningToBookingData = (screening: Screening): MovieScreeningBookingData => {
  const screeningDate = new Date(screening.beginningDatetime)
  return {
    stockId: screening.stockId,
    date: screeningDate,
    hour: screeningDate.getHours(),
  } as MovieScreeningBookingData
}

export const BookOfferModal = ({
  screening,
  offerId,
  modalSettings,
  from,
}: BookOfferModalProps) => {
  switch (screening?.bookability) {
    case Bookability.AUTHENTICATION_REQUIRED:
      return (
        <AuthenticationModal
          visible={modalSettings.visible}
          hideModal={modalSettings.hideModal}
          offerId={offerId}
          from={from}
        />
      )
    case Bookability.BOOKABLE:
      return (
        <BookingOfferModal
          visible={modalSettings.visible}
          dismissModal={modalSettings.hideModal}
          offerId={offerId}
          bookingDataMovieScreening={screeningToBookingData(screening)}
        />
      )
    case Bookability.USER_APPLICATION_STILL_PROCESSING:
      return (
        <ApplicationProcessingModal
          visible={modalSettings.visible}
          hideModal={modalSettings.hideModal}
          offerId={offerId}
        />
      )
    case Bookability.FINISH_SUBSCRIPTION_REQUIRED:
      return (
        <FinishSubscriptionModal
          visible={modalSettings.visible}
          hideModal={modalSettings.hideModal}
          from={StepperOrigin.OFFER}
        />
      )
    case Bookability.USER_HAS_APPLICATION_ERROR:
      return (
        <ErrorApplicationModal
          visible={modalSettings.visible}
          hideModal={modalSettings.hideModal}
          offerId={offerId}
        />
      )
    default:
      return null
  }
}
