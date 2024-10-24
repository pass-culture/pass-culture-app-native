import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Show } from 'ui/svg/icons/Show'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  distance?: string
  title: string
  venue: OfferVenueResponse
  onChangeVenuePress?: VoidFunction
  onSeeVenuePress?: VoidFunction
  onSeeItineraryPress?: VoidFunction
}

export function OfferVenueBlockDeprecated({
  distance,
  onChangeVenuePress,
  onSeeVenuePress,
  onSeeItineraryPress,
  title,
  venue,
}: Readonly<Props>) {
  const { venueName, address, onCopyAddressPress } = useVenueBlock({ venue })
  const venueFullAddress = formatFullAddressStartsWithPostalCode(
    venue.address,
    venue.postalCode,
    venue.city
  )

  return (
    <Container>
      <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>

      <Spacer.Column numberOfSpaces={4} />
      <StyledSeparator />
      <Spacer.Column numberOfSpaces={6} />

      <Typo.ButtonText>{venueName}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={1} />
      <Address>{address}</Address>

      {distance ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Tag label={`à ${distance}`} />
        </React.Fragment>
      ) : null}

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

      {onSeeVenuePress ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <TertiaryButtonWrapper>
            <ButtonTertiaryBlack
              inline
              wording="Voir la page du lieu"
              onPress={onSeeVenuePress}
              icon={Show}
            />
          </TertiaryButtonWrapper>
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))

const TertiaryButtonWrapper = styled.View({
  alignItems: 'flex-start',
})

const Address = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Container = styled(View)(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : getSpacing(6),
}))
