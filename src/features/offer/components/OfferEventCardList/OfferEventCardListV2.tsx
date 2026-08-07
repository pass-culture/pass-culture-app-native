import React, { FC, useCallback, useState } from 'react'
import { View } from 'react-native'

import { Screening, VenueScreenings } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import {
  getEventCardIsEnabled,
  getEventCardLeftSubtitle,
  getEventCardRightSubtitle,
} from 'features/offer/helpers/screeningBlockInfo/screeningBlockInfo'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BookOfferModal } from 'shared/offer/components/BookOfferModal/BookOfferModal'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { useModal } from 'ui/components/modals/useModal'

type Props = {
  venueScreenings: VenueScreenings
  offerId: number
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
        isDisabled: !getEventCardIsEnabled(screening),
        title: formatHour(screening.beginningDatetime).replace(':', 'h'),
        subtitleLeft: getEventCardLeftSubtitle(screening),
        subtitleRight: getEventCardRightSubtitle(screening, currency, euroToPacificFrancRate),
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
          modalSettings={modalSettings}
          from={StepperOrigin.OFFER}></BookOfferModal>
      ) : null}
    </View>
  )
}
