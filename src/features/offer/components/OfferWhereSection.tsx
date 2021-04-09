import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Coordinates } from 'api/gen'
import { analytics } from 'libs/analytics'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo, ColorsEnum } from 'ui/theme'

import { useDistance } from './useDistance'

type Props = {
  address: string | null
  offerId: number
  offerCoordinates: Coordinates
}

export const OfferWhereSection: React.FC<Props> = ({ address, offerCoordinates, offerId }) => {
  const { latitude: lat, longitude: lng } = offerCoordinates
  const distanceToOffer = useDistance({ lat, lng })
  const { canOpenItinerary, openItinerary } = useOpenItinerary(lat, lng, () =>
    analytics.logConsultItinerary(offerId)
  )

  if (distanceToOffer === undefined && address === null) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Où ?`}</Typo.Title4>
      {address && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Adresse`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      )}
      {distanceToOffer && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Distance`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{distanceToOffer}</Typo.Body>
        </React.Fragment>
      )}

      {canOpenItinerary && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <SeeItineraryButton openItinerary={openItinerary} />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})

const Separator = styled.View({
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
})
