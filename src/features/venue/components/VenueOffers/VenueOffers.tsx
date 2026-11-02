import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { SpecialEventVenueMovies } from 'features/venue/components/VenueOffers/SpecialEventVenueMovies'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueMoviesV2 } from 'features/venue/components/VenueOffers/VenueMoviesV2'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import { VenueSurveyBanner } from 'features/venue/components/VenueOffers/VenueSurveyBanner'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import {
  checkVenueSurveyAccess,
  markVenueSurveyAccess,
} from 'features/venue/helpers/venueSurveyAccessStorage'
import type { VenueOffers, VenueOffersArtists } from 'features/venue/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useUserLocation, useLocationMode } from 'libs/locationV2/location.store'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export interface VenueOffersProps {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffers
  playlists: GtlPlaylistData[]
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  arePlaylistsLoading: boolean
}

const LoadingState: React.FC = () => (
  <StyledOfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
)

export function VenueOffers({
  venue,
  venueArtists,
  venueOffers,
  playlists,
  mapping,
  labelMapping,
  currency,
  euroToPacificFrancRate,
  arePlaylistsLoading,
}: Readonly<VenueOffersProps>) {
  const userLocation = useUserLocation()
  const selectedLocationMode = useLocationMode()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const { isLoading: areVenueOffersLoading } = useVenueOffersQuery({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })
  const wipUseVenueMovieScreeningsEndpoint = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_USE_VENUE_MOVIE_SCREENINGS_ENDPOINT
  )
  const enableSpecialEventScreenings = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_SPECIAL_EVENT_SCREENINGS
  )
  const enableVenueSurvey = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_VENUE_SURVEY)
  const [hasSurveyAccess, setHasSurveyAccess] = useState(false)
  const surveyConfig = getSurveyConfigFromActivity(venue.activity)

  useEffect(
    function checkVenueSurveyAccessEffect() {
      if (!enableVenueSurvey || !surveyConfig?.key) {
        return
      }

      void checkVenueSurveyAccess(surveyConfig.key).then((isAccessed) => {
        setHasSurveyAccess(!isAccessed)
      })
    },
    [enableVenueSurvey, surveyConfig?.key]
  )

  const handleOnSurveyBeforeNavigate = async () => {
    if (surveyConfig) {
      await markVenueSurveyAccess(surveyConfig.key)
      setHasSurveyAccess(false)
    }
  }

  const VenueSurveyBannerComponent =
    enableVenueSurvey && hasSurveyAccess ? (
      <VenueSurveyBanner
        activity={venue.activity}
        onBeforeNavigate={handleOnSurveyBeforeNavigate}
      />
    ) : null

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return (
      <ViewGap gap={6}>
        <NoOfferPlaceholder isOpenToPublic={venue.isOpenToPublic} />
        {VenueSurveyBannerComponent}
      </ViewGap>
    )
  }

  const hasAMovieScreeningOffer = venueOffers.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  if (hasAMovieScreeningOffer) {
    let VenueMoviesComponent = <VenueMovies venueOffers={venueOffers} />
    if (enableSpecialEventScreenings)
      VenueMoviesComponent = <SpecialEventVenueMovies venueOffers={venueOffers} />
    if (wipUseVenueMovieScreeningsEndpoint)
      VenueMoviesComponent = <VenueMoviesV2 venueOffers={venueOffers} venueId={venue.id} />

    return (
      <React.Fragment>
        {VenueMoviesComponent}
        {VenueSurveyBannerComponent}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <VenueOffersList
        venue={venue}
        venueArtists={venueArtists}
        venueOffers={venueOffers}
        playlists={playlists}
        mapping={mapping}
        labelMapping={labelMapping}
        currency={currency}
        euroToPacificFrancRate={euroToPacificFrancRate}
        arePlaylistsLoading={arePlaylistsLoading}
      />
      {VenueSurveyBannerComponent}
    </React.Fragment>
  )
}

const StyledOfferPlaylistSkeleton = styled(OfferPlaylistSkeleton)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
