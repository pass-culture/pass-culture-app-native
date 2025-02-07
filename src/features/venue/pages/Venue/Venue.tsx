import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import Animated, { Layout } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { offerToHeadlineOfferData } from 'features/headlineOffer/adapters/offerToHeadlineOfferData'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { useVenueOffersArtists } from 'features/venue/api/useVenueOffersArtists/useVenueOffersArtists'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { VENUE_CTA_HEIGHT_IN_SPACES } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { offersFixture } from 'shared/offer/offer.fixture'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { gtlPlaylists } = useGTLPlaylists({ venue, queryKey: 'VENUE_GTL_PLAYLISTS' })
  const { data: venueOffers } = useVenueOffers(venue)
  const { data: venueArtists } = useVenueOffersArtists(venue)
  const { isDesktopViewport } = useTheme()

  const { userLocation } = useLocation()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const isVenueHeadlineOfferActive = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_HEADLINE_OFFER
  )

  const headlineOfferData = isVenueHeadlineOfferActive
    ? offerToHeadlineOfferData({
        // Fake data to remove
        offer: offersFixture[0],
        transformParameters: {
          currency,
          euroToPacificFrancRate,
          mapping,
          labelMapping,
          userLocation,
        },
      })
    : null

  useEffect(() => {
    if ((params.from === 'deeplink' || params.from === 'venueMap') && venue?.id) {
      analytics.logConsultVenue({ venueId: venue.id, from: params.from })
    }
  }, [params.from, venue?.id])

  const isCTADisplayed =
    venue?.venueTypeCode !== VenueTypeCodeKey.MOVIE &&
    ((venueOffers && venueOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0))

  return venue ? (
    <OfferCTAProvider>
      <VenueContent venue={venue} isCTADisplayed={isCTADisplayed}>
        <VenueTopComponent venue={venue} />
        <ViewGap gap={isDesktopViewport ? 10 : 6}>
          <Animated.View layout={Layout.duration(200)}>
            <VenueBody
              venue={venue}
              playlists={gtlPlaylists}
              venueOffers={venueOffers}
              venueArtists={venueArtists}
              headlineOfferData={headlineOfferData}
            />

            <VenueThematicSection venue={venue} />

            <VenueMessagingApps venue={venue} />

            <EmptyBottomSection isVisible={!!isCTADisplayed} />
          </Animated.View>
        </ViewGap>
      </VenueContent>
    </OfferCTAProvider>
  ) : null
}

const EmptyBottomSection = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <SectionWithDivider visible={isVisible} gap={VENUE_CTA_HEIGHT_IN_SPACES}>
      <EmptySectionContainer />
    </SectionWithDivider>
  )
}

const EmptySectionContainer = styled.View({ marginBottom: getSpacing(6) })
