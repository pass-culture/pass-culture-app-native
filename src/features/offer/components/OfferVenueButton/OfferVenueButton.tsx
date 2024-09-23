import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { analytics } from 'libs/analytics'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { TypoDS } from 'ui/theme'

interface Props {
  venue: OfferVenueResponse
}

export function OfferVenueButton({ venue }: Readonly<Props>) {
  const theme = useTheme()
  const venueName = venue.publicName || venue.name

  return (
    <HeroButtonList
      Title={<TypoDS.BodySemiBold>{venueName}</TypoDS.BodySemiBold>}
      Subtitle={
        venue.city ? <SubtitleText testID="subtitle">{venue.city}</SubtitleText> : undefined
      }
      Icon={<LocationPointer color={theme.colors.black} size={theme.icons.sizes.small} />}
      navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
      onBeforeNavigate={() => analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })}
      accessibilityLabel={`Accéder à la page du lieu ${venueName}`}
    />
  )
}

const SubtitleText = styled(TypoDS.BodySemiBoldXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
