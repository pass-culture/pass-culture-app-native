import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useVenueBlock } from 'features/offerv2/components/OfferVenueBlock/useVenueBlock'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

type Props = {
  distance?: string
  title: string
  offer: OfferResponse
  onChangeVenuePress?: VoidFunction
  onSeeVenuePress?: VoidFunction
  onSeeItineraryPress?: VoidFunction
}

export function OfferVenueBlock({
  distance,
  onChangeVenuePress,
  onSeeVenuePress,
  onSeeItineraryPress,
  title,
  offer,
}: Readonly<Props>) {
  const { venue } = offer
  const { venueName, address, onCopyAddressPress } = useVenueBlock({ venue })
  const venueFullAddress = formatFullAddressStartsWithPostalCode(
    venue.address,
    venue.postalCode,
    venue.city
  )
  const hasVenuePage = !!onSeeVenuePress
  const TouchableContainer: FunctionComponent<ComponentProps<typeof InternalTouchableLink>> =
    useMemo(
      () =>
        styled(hasVenuePage ? InternalTouchableLink : View)({
          flexDirection: 'row',
        }),
      [hasVenuePage]
    )

  return (
    <Container>
      <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />

      {distance ? (
        <React.Fragment>
          <Tag label={`à ${distance}`} />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <TouchableContainer
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onBeforeNavigate={onSeeVenuePress}>
        <VenueThumbnail
          height={VENUE_THUMBNAIL_SIZE}
          width={VENUE_THUMBNAIL_SIZE}
          url="https://storage.googleapis.com/passculture-metier-ehp-staging-assets-fine-grained/assets/venue_default_images/becca-tapert-GnY_mW1Q6Xc-unsplash.png"
        />
        <Spacer.Row numberOfSpaces={2} />
        <VenueRightContainer>
          <VenueTitleContainer>
            <Typo.ButtonText>{venueName}</Typo.ButtonText>
            {hasVenuePage ? (
              <React.Fragment>
                <Spacer.Row numberOfSpaces={1} />
                <RightFilled size={16} testID="RightFilled" />
              </React.Fragment>
            ) : null}
          </VenueTitleContainer>
          <Spacer.Column numberOfSpaces={1} />
          <Address>{address}</Address>
        </VenueRightContainer>
      </TouchableContainer>

      {onChangeVenuePress ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonSecondaryBlack
            icon={EditPen}
            wording="Changer le lieu de retrait"
            onPress={onChangeVenuePress}
          />
        </React.Fragment>
      ) : null}

      <Spacer.Column numberOfSpaces={6} />
      <StyledSeparator />
      <Spacer.Column numberOfSpaces={4} />

      <Spacer.Column numberOfSpaces={2} />
      <TertiaryButtonWrapper>
        <ButtonTertiaryBlack
          inline
          wording="Copier l’adresse"
          onPress={onCopyAddressPress}
          icon={Duplicate}
        />
      </TertiaryButtonWrapper>

      {onSeeItineraryPress ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <SeeItineraryButton
            externalNav={{
              url: getGoogleMapsItineraryUrl(venueFullAddress),
              address: venueFullAddress,
            }}
            onPress={onSeeItineraryPress}
          />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View({
  maxWidth: 500,
})

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))

const VenueRightContainer = styled.View({
  flexShrink: 1,
})

const VenueTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))

const TertiaryButtonWrapper = styled.View({
  alignItems: 'flex-start',
})

const Address = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
