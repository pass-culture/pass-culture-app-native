import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import type { VenueOffersArtists, VenueOffers as VenueOffersType } from 'features/venue/types'
import { Tab } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

interface Props {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffersType
  playlists?: GtlPlaylistData[]
}

export const VenueBody: FunctionComponent<Props> = ({
  venue,
  venueArtists,
  venueOffers,
  playlists,
}) => {
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const SectionContainer = isLargeScreen ? View : SectionWithDivider

  const tabPanels = {
    [Tab.OFFERS]: (
      <VenueOffers
        venue={venue}
        venueArtists={venueArtists}
        venueOffers={venueOffers}
        playlists={playlists}
      />
    ),
    [Tab.INFOS]: <PracticalInformation venue={venue} />,
  }

  return (
    <SectionContainer visible gap={6}>
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
        onTabChange={{
          'Offres disponibles': () =>
            analytics.logConsultVenueOffers({
              venueId: venue.id,
            }),
          'Infos pratiques': () =>
            analytics.logConsultPracticalInformations({
              venueId: venue.id,
            }),
        }}
      />
    </SectionContainer>
  )
}
