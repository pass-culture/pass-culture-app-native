import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Coordinates } from 'api/gen'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo, ColorsEnum } from 'ui/theme'

type Props = {
  address: string | null
  beforeNavigateToItinerary?: () => Promise<void>
  locationCoordinates: Coordinates
}

export const WhereSection: React.FC<Props> = ({
  address,
  locationCoordinates,
  beforeNavigateToItinerary,
}) => {
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })
  const { canOpenItinerary, openItinerary } = useOpenItinerary(lat, lng, beforeNavigateToItinerary)

  if (distanceToLocation === undefined && address === null) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Où ?`}</Typo.Title4>
      {!!address && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Adresse`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      )}
      {!!distanceToLocation && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Distance`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{distanceToLocation}</Typo.Body>
        </React.Fragment>
      )}

      {!!canOpenItinerary && (
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
