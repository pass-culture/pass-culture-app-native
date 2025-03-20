import React, { Fragment } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { getAddress, getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  offer: OfferResponseV2
  onChangeVenuePress?: VoidFunction
  onSeeVenuePress?: VoidFunction
  onSeeItineraryPress?: VoidFunction
  distance?: string | null
}

export function OfferVenueBlock({
  onChangeVenuePress,
  onSeeVenuePress,
  onSeeItineraryPress,
  title,
  offer,
  distance,
}: Readonly<Props>) {
  const venueBlockVenue = getVenue(offer.venue)
  const venueBlockAddress = getAddress(offer.address)

  const isCinema = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const addressLabel = venueBlockAddress?.label ?? undefined
  const venueImageUrl = venueBlockVenue.bannerUrl ?? ''

  const { venueName, venueAddress, isOfferAddressDifferent, onCopyAddressPress } = useVenueBlock({
    venue: venueBlockVenue,
    offerAddress: venueBlockAddress,
  })

  return (
    <Wrapper>
      <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>

      <Container>
        <VenueBlock
          venueId={venueBlockVenue.id}
          distance={distance}
          hasVenuePage={!!onSeeVenuePress && !isOfferAddressDifferent}
          onSeeVenuePress={onSeeVenuePress}
          title={isOfferAddressDifferent ? addressLabel : venueName}
          subtitle={venueAddress}
          venueImageUrl={isOfferAddressDifferent ? '' : venueImageUrl}
        />

        {onChangeVenuePress ? (
          <Container>
            <ButtonSecondaryBlack
              icon={EditPen}
              wording={isCinema ? 'Changer de cinéma' : 'Changer le lieu de retrait'}
              onPress={onChangeVenuePress}
            />
          </Container>
        ) : null}
      </Container>

      {isCinema ? null : (
        <Fragment>
          <StyledHorizontalSeparator />
          <TertiaryButtonWrapper>
            <ButtonTertiaryBlack
              inline
              wording="Copier l’adresse"
              onPress={onCopyAddressPress}
              icon={Duplicate}
            />
          </TertiaryButtonWrapper>

          {onSeeItineraryPress ? (
            <ItineraryContainer>
              <SeeItineraryButton
                externalNav={{
                  url: getGoogleMapsItineraryUrl(venueAddress),
                  address: venueAddress,
                }}
                onPress={onSeeItineraryPress}
              />
            </ItineraryContainer>
          ) : null}
        </Fragment>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(View)(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : getSpacing(6),
}))

const TertiaryButtonWrapper = styled.View({
  alignItems: 'flex-start',
})

const ItineraryContainer = styled.View({
  marginTop: getSpacing(6),
})

const StyledHorizontalSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(6),
})

const Container = styled.View({ marginTop: getSpacing(4) })
