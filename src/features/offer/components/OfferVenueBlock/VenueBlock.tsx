import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { getSpacing, Spacer } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

type Props = {
  distance?: string
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

export function VenueBlock({ distance, onSeeVenuePress, offer }: Readonly<Props>) {
  const { venue } = offer
  const { venueName, address } = useVenueBlock({ venue })

  const hasVenuePage = !!onSeeVenuePress
  const TouchableContainer: FunctionComponent<ComponentProps<typeof InternalTouchableLink>> =
    useMemo(
      () =>
        styled(hasVenuePage ? InternalTouchableLink : View)({
          flexDirection: 'row',
          maxWidth: 500,
        }),
      [hasVenuePage]
    )

  return (
    <React.Fragment>
      {distance ? (
        <React.Fragment>
          <Tag label={`à ${distance}`} />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <TouchableContainer
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onBeforeNavigate={onSeeVenuePress}>
        <VenuePreview
          address={address}
          bannerUrl={venue.bannerUrl}
          withRightArrow={hasVenuePage}
          venueName={venueName}
          imageWidth={VENUE_THUMBNAIL_SIZE}
          imageHeight={VENUE_THUMBNAIL_SIZE}
        />
      </TouchableContainer>
    </React.Fragment>
  )
}