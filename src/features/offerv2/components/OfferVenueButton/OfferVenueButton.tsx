import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

interface Props {
  venue: OfferVenueResponse
}

export function OfferVenueButton({ venue }: Readonly<Props>) {
  const theme = useTheme()
  const venueName = venue.publicName || venue.name

  return (
    <HeroButtonList
      Title={<Typo.ButtonText>{venueName}</Typo.ButtonText>}
      Subtitle={
        venue.city ? <SubtitleText testID="subtitle">{venue.city}</SubtitleText> : undefined
      }
      Icon={<LocationPointer color={theme.colors.black} size={theme.icons.sizes.small} />}
      navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
      accessibilityLabel={`Accéder à la page du lieu ${venue.publicName ?? venue.name}`}
    />
  )
}

const SubtitleText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
