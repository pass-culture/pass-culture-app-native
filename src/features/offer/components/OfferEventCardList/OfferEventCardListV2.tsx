import React, { FC, useCallback, useState } from 'react'
import { View } from 'react-native'

import { Bookability, Screening, VenueScreenings } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BookOfferModal } from 'shared/offer/components/BookOfferModal/BookOfferModal'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { useModal } from 'ui/components/modals/useModal'

type Props = {
  venueScreenings: VenueScreenings
  offerId: number
}

const getEventCardLeftSubtitle = (screening: Screening) => {
  switch (screening.bookability) {
    case Bookability.STOCK_BOOKING_IS_DISABLED:
      return EventCardSubtitleEnum.UNAVAILABLE
    case Bookability.STOCK_IS_SOLD_OUT:
      return EventCardSubtitleEnum.FULLY_BOOKED
    case Bookability.USER_HAS_ALREADY_BOOKED_OFFER:
      return EventCardSubtitleEnum.ALREADY_BOOKED
    case Bookability.USER_HAS_INSUFFICIENT_CREDIT:
      return EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
    case Bookability.USER_CANNOT_BOOK:
      return EventCardSubtitleEnum.UNAVAILABLE
    case Bookability.AUTHENTICATION_REQUIRED:
    case Bookability.BOOKABLE:
      return screening.features.join(', ')
  }
}

export const OfferEventCardListV2: FC<Props> = ({ venueScreenings, offerId }) => {
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const [selectedScreening, setSelectedScreening] = useState<Screening>()
  const modalSettings = useModal(false)

  const transformScreening = useCallback(
    (screening: Screening) =>
      ({
        onPress: () => {
          setSelectedScreening(screening)
          modalSettings.showModal()
        },
        isDisabled: ![Bookability.AUTHENTICATION_REQUIRED, Bookability.BOOKABLE].includes(
          screening.bookability
        ),
        title: formatHour(screening.beginningDatetime).replace(':', 'h'),
        subtitleLeft: getEventCardLeftSubtitle(screening),
        subtitleRight: [Bookability.AUTHENTICATION_REQUIRED, Bookability.BOOKABLE].includes(
          screening.bookability
        )
          ? formatCurrencyFromCents(screening.price * 100, currency, euroToPacificFrancRate)
          : '',
      }) as EventCardProps,
    [currency, euroToPacificFrancRate, modalSettings]
  )

  return (
    <View testID="offer-event-card-list">
      {venueScreenings?.dayScreenings ? (
        <EventCardList data={venueScreenings.dayScreenings.map(transformScreening)} />
      ) : null}
      {selectedScreening ? (
        <BookOfferModal
          screening={selectedScreening}
          offerId={offerId}
          modalSettings={modalSettings}></BookOfferModal>
      ) : null}
    </View>
  )
}
