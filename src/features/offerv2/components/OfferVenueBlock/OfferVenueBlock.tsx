import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { useVenueBlock } from 'features/offerv2/components/OfferVenueBlock/useVenueBlock'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Show } from 'ui/svg/icons/Show'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  distance?: string
  title: string
  venue: OfferVenueResponse
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
  venue,
}: Readonly<Props>) {
  const { venueName, address, onCopyAddressPress } = useVenueBlock({ venue })

  return (
    <View>
      <Typo.Title3>{title}</Typo.Title3>

      <Spacer.Column numberOfSpaces={4} />
      <StyleSeparator />
      <Spacer.Column numberOfSpaces={6} />

      <Typo.ButtonText>{venueName}</Typo.ButtonText>
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
      <StyleSeparator />
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
          <TertiaryButtonWrapper>
            <ButtonTertiaryBlack
              inline
              wording="Voir l’itinéraire"
              onPress={onSeeItineraryPress}
              icon={LocationPointer}
            />
          </TertiaryButtonWrapper>
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
    </View>
  )
}

const StyleSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))

const TertiaryButtonWrapper = styled.View({
  alignItems: 'flex-start',
})

const Address = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
