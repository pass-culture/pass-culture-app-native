import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { Typo } from 'ui/theme'

interface Props {
  venue: OfferVenueResponse
}

export function OfferVenueButton({ venue }: Readonly<Props>) {
  const theme = useTheme()

  return (
    <HeroButtonList
      Title={<Typo.BodyAccent>{venue.name}</Typo.BodyAccent>}
      Subtitle={
        venue.city ? <SubtitleText testID="subtitle">{venue.city}</SubtitleText> : undefined
      }
      Icon={
        <LocationBuildingFilled
          color={theme.designSystem.color.icon.default}
          size={theme.icons.sizes.small}
        />
      }
      navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
      onBeforeNavigate={() => analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })}
      accessibilityLabel={`Accéder à la page du lieu ${venue.name}`}
    />
  )
}

const SubtitleText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
