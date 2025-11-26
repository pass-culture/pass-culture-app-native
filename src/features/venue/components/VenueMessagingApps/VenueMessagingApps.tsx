import React, { useCallback } from 'react'
import { Social } from 'react-native-share'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { analytics } from 'libs/analytics/provider'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type MessagingAppsProps = {
  venue: Omit<VenueResponse, 'isVirtual'>
}

export const VenueMessagingApps = ({ venue }: MessagingAppsProps) => {
  const { share, shareContent } = getShareVenue({ venue, utmMedium: 'social_media' })

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Venue', venueId: venue.id, from: 'venue', social })
    },
    [venue.id]
  )

  if (!shareContent?.url) return null

  return (
    <SectionWithDivider visible margin gap={6}>
      <Container>
        <MessagingApps
          shareContent={shareContent}
          share={share}
          messagingAppAnalytics={messagingAppAnalytics}
        />
      </Container>
    </SectionWithDivider>
  )
}

const Container = styled.View(({ theme }) => ({ marginBottom: theme.designSystem.size.spacing.l }))
