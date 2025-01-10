import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { useDistance } from 'libs/location/hooks/useDistance'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getSpacing, Spacer } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

type Props = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

export function VenueBlock({ onSeeVenuePress, offer }: Readonly<Props>) {
  const { venue, address } = offer
  const { venueName, venueAddress, isOfferAddressDifferent } = useVenueBlock({
    venue,
    offerAddress: address,
  })
  const theme = useTheme()

  const { latitude: lat, longitude: lng } = offer.venue.coordinates
  const distance = useDistance({ lat, lng })
  const hasVenuePage = !!onSeeVenuePress && !isOfferAddressDifferent
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
        <InfoHeader
          title={venueName}
          subtitle={venueAddress}
          rightComponent={
            hasVenuePage ? (
              <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
            ) : null
          }
          thumbnailComponent={
            venue.bannerUrl ? (
              <VenueThumbnail
                url={venue.bannerUrl}
                height={VENUE_THUMBNAIL_SIZE}
                width={VENUE_THUMBNAIL_SIZE}
                testID="VenuePreviewImage"
              />
            ) : null
          }
          defaultThumbnailSize={VENUE_THUMBNAIL_SIZE}
        />
      </TouchableContainer>
    </React.Fragment>
  )
}

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))
