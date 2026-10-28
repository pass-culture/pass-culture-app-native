import React, { FC, useState } from 'react'
import { View } from 'react-native'

import { ScreeningV2, VenueScreeningsV2 } from 'api/gen'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import { getCinemaScreeningCardProps } from 'features/offer/components/CinemaScreeningCard/getCinemaScreeningCardProps'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BookOfferModal } from 'shared/offer/components/BookOfferModal/BookOfferModal'
import { useModal } from 'ui/components/modals/useModal'

type Props = {
  venueScreenings: VenueScreeningsV2
  offerId: number
}

export const OfferEventCardListV2: FC<Props> = ({ venueScreenings, offerId }) => {
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const [selectedScreening, setSelectedScreening] = useState<ScreeningV2>()
  const modalSettings = useModal(false)
  const screeningCards = venueScreenings.dayScreenings.map((screening) =>
    getCinemaScreeningCardProps(
      screening,
      () => {
        setSelectedScreening(screening)
        modalSettings.showModal()
      },
      currency,
      euroToPacificFrancRate
    )
  )

  return (
    <View testID="offer-event-card-list">
      {venueScreenings.dayScreenings.length ? (
        <CinemaScreeningCardList screenings={screeningCards} />
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
