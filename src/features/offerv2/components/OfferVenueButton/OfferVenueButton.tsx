import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

interface Props {
  venue: OfferVenueResponse
}

export function OfferVenueButton({ venue }: Readonly<Props>) {
  const theme = useTheme()

  return (
    <HeroButtonList
      Title={<Typo.ButtonText>{venue.publicName ?? venue.name}</Typo.ButtonText>}
      Subtitle={
        venue.city ? <SubtitleText testID="subtitle">{venue.city}</SubtitleText> : undefined
      }
      icon={LocationPointer}
      navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
      accessibilityLabel={`Accéder à la page du lieu ${venue.publicName ?? venue.name}`}
      iconProps={{
        color: theme.colors.black,
        color2: theme.colors.black,
        size: theme.icons.sizes.small,
      }}
    />
  )
}

const SubtitleText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
