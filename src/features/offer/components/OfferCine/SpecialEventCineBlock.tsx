import React, { FunctionComponent } from 'react'

import { OfferForStocksResponse } from 'api/gen'
import { CineBlockBase } from 'features/offer/components/OfferCine/CineBlockBase'
import { SpecialEventOfferEventCardList } from 'features/offer/components/OfferEventCardList/SpecialEventOfferEventCardList'
import { getCinemaOfferForCTA } from 'features/offer/helpers/getCinemaOfferForCTA'

export type SpecialEventCineBlockProps = {
  offer: OfferForStocksResponse
  onSeeVenuePress?: VoidFunction
  nextDate?: Date
  withDivider?: boolean
}

export const SpecialEventCineBlock: FunctionComponent<SpecialEventCineBlockProps> = ({
  offer,
  onSeeVenuePress,
  nextDate,
  withDivider,
}) => {
  const ctaOffer = getCinemaOfferForCTA(offer)

  return (
    <CineBlockBase
      offer={ctaOffer}
      ctaOffer={ctaOffer}
      onSeeVenuePress={onSeeVenuePress}
      nextDate={nextDate}
      withDivider={withDivider}
      renderScreenings={(selectedDate) => (
        <SpecialEventOfferEventCardList offer={offer} selectedDate={selectedDate} />
      )}
    />
  )
}
