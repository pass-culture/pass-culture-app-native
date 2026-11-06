import React, { FunctionComponent } from 'react'

import { OfferResponse } from 'api/gen'
import { CineBlockBase } from 'features/offer/components/OfferCine/CineBlockBase'
import { OfferEventCardList } from 'features/offer/components/OfferEventCardList/OfferEventCardList'

export type CineBlockProps = {
  offer: OfferResponse
  onSeeVenuePress?: VoidFunction
  nextDate?: Date
  withDivider?: boolean
}

export const CineBlock: FunctionComponent<CineBlockProps> = ({
  offer,
  onSeeVenuePress,
  nextDate,
  withDivider,
}) => (
  <CineBlockBase
    offer={offer}
    ctaOffer={offer}
    onSeeVenuePress={onSeeVenuePress}
    nextDate={nextDate}
    withDivider={withDivider}
    renderScreenings={(selectedDate) => (
      <OfferEventCardList offer={offer} selectedDate={selectedDate} />
    )}
  />
)
