import React, { useMemo } from 'react'
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
  const venueName = venue.publicName ?? venue.name
  const iconProps = useMemo(
    () => ({
      color: theme.colors.black,
      color2: theme.colors.black,
      size: theme.icons.sizes.small,
    }),
    [theme.colors.black, theme.icons.sizes.small]
  )

  return (
    <HeroButtonList
      Title={<Typo.ButtonText>{venueName}</Typo.ButtonText>}
      Subtitle={
        venue.city ? <SubtitleText testID="subtitle">{venue.city}</SubtitleText> : undefined
      }
      icon={LocationPointer}
      navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
      accessibilityLabel={`Accéder à la page du lieu ${venue.publicName ?? venue.name}`}
      iconProps={iconProps}
    />
  )
}

const SubtitleText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
