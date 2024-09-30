import React, { ComponentProps, Fragment, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

type Props = {
  distance?: string
  title: string
  offer: OfferResponseV2
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
          maxWidth: 500,
        }),
      [hasVenuePage]
    )

  const isCinema = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  return (
    <Container>
      <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
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
        <VenuePreview
          address={address}
          bannerUrl={venue.bannerUrl}
          withRightArrow={hasVenuePage}
          imageHeight={VENUE_THUMBNAIL_SIZE}
          imageWidth={VENUE_THUMBNAIL_SIZE}
          venueName={venueName}
        />
      </TouchableContainer>

      {onChangeVenuePress ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonSecondaryBlack
            icon={EditPen}
            wording={isCinema ? 'Changer de cinéma' : 'Changer le lieu de retrait'}
            onPress={onChangeVenuePress}
          />
        </React.Fragment>
      ) : null}

      {isCinema ? null : (
        <Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Separator.Horizontal />
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
        </Fragment>
      )}
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : getSpacing(6),
}))

const TertiaryButtonWrapper = styled.View({
  alignItems: 'flex-start',
})
