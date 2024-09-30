import React, { Fragment } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
  const { onCopyAddressPress } = useVenueBlock({ venue })
  const venueFullAddress = formatFullAddressStartsWithPostalCode(
    venue.address,
    venue.postalCode,
    venue.city
  )

  const isCinema = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  return (
    <Container>
      <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
      <Spacer.Column numberOfSpaces={4} />

      <React.Fragment>
        <VenueBlock distance={distance} offer={offer} onSeeVenuePress={onSeeVenuePress} />

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
      </React.Fragment>

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
