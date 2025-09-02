import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import Animated, { Layout } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { offerToHeadlineOfferData } from 'features/headlineOffer/adapters/offerToHeadlineOfferData'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { VENUE_CTA_HEIGHT_IN_SPACES } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/location'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenueQuery(params.id)

  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const transformHits = useTransformOfferHits()
  const { data: gtlPlaylists, isInitialLoading: arePlaylistsLoading } = useGTLPlaylistsQuery({
    venue,
    searchGroupLabel: params?.fromThematicSearch,
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    adaptPlaylistParameters,
    queryKey: 'VENUE_GTL_PLAYLISTS',
    transformHits,
  })

  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const { data: venueOffers } = useVenueOffersQuery({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })
  const {
    data: { artistPageSubcategories },
  } = useRemoteConfigQuery()
  const { data: venueArtists } = getVenueOffersArtists(
    artistPageSubcategories.subcategories,
    venueOffers?.hits
  )
  const { isDesktopViewport } = useTheme()

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const isVenueHeadlineOfferActive = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_HEADLINE_OFFER
  )
  const enableAccesLibre = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_ACCES_LIBRE)

  const headlineOfferData = isVenueHeadlineOfferActive
    ? offerToHeadlineOfferData({
        offer: venueOffers?.headlineOffer,
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
      analytics.logConsultVenue({ venueId: venue.id.toString(), from: params.from })
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
              playlists={gtlPlaylists || []}
              venueOffers={venueOffers}
              venueArtists={venueArtists}
              headlineOfferData={headlineOfferData}
              arePlaylistsLoading={arePlaylistsLoading}
              enableAccesLibre={enableAccesLibre}
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

const EmptySectionContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
