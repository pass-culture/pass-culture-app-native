import React from 'react'
import styled from 'styled-components/native'

import { ConsultOfferAnalyticsParams } from 'libs/analytics/types'
import { Offer } from 'shared/offer/types'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Spacer, getSpacing } from 'ui/theme'

interface OfferListProps {
  offers: Offer[]
  hideModal: () => void
  analyticsParams: ConsultOfferAnalyticsParams
}

export const VideoMultiOfferList: React.FC<OfferListProps> = ({
  offers,
  hideModal,
  analyticsParams,
}) => {
  return (
    <React.Fragment>
      {offers.map((offer: Offer) => (
        <React.Fragment key={offer.objectID}>
          <HorizontalOfferTile
            offer={offer}
            onPress={hideModal}
            analyticsParams={analyticsParams}
          />
          <StyledSeparator />
        </React.Fragment>
      ))}
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledSeparator = styled(Separator)({
  height: 2,
  marginVertical: getSpacing(4),
})
