import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import type { VenueOffers as VenueOffersType } from 'features/venue/api/useVenueOffers'
import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VENUE_CTA_HEIGHT_IN_SPACES } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { analytics } from 'libs/analytics'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

interface Props {
  venue: VenueResponse
  onScroll: () => void
  venueOffers?: VenueOffersType
  playlists?: GtlPlaylistData[]
  shouldDisplayCTA?: boolean
}

export const VenueBody: FunctionComponent<Props> = ({
  venue,
  onScroll,
  venueOffers,
  playlists,
  shouldDisplayCTA,
}) => {
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const FirstSectionContainer = isLargeScreen ? View : SectionWithDivider

  return (
    <Container onScroll={onScroll} scrollEventThrottle={16} bounces={false}>
      {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
      <VenueTopComponent venue={venue} />

      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />

      <FirstSectionContainer visible gap={6}>
        <TabLayout
          tabPanels={{
            'Offres disponibles': (
              <VenueOffers venue={venue} venueOffers={venueOffers} playlists={playlists} />
            ),
            'Infos pratiques': <PracticalInformation venue={venue} />,
          }}
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
      </FirstSectionContainer>

      <Spacer.Column numberOfSpaces={6} />

      <VenueThematicSection venue={venue} />

      <SectionWithDivider visible margin gap={6}>
        <VenueMessagingApps venue={venue} />
        <Spacer.Column numberOfSpaces={4} />
      </SectionWithDivider>

      <SectionWithDivider visible={!!shouldDisplayCTA} gap={VENUE_CTA_HEIGHT_IN_SPACES}>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const Container = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
