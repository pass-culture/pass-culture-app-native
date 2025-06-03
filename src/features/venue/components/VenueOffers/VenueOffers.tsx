import React from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import type { VenueOffers, VenueOffersArtists } from 'features/venue/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { getSpacing } from 'ui/theme'

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
  const { userLocation, selectedLocationMode } = useLocation()
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

  const isOfferAMovieScreening = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  if (isOfferAMovieScreening) {
    return <VenueMovies venueOffers={venueOffers} />
  }

  return (
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
  )
}

const StyledOfferPlaylistSkeleton = styled(OfferPlaylistSkeleton)({
  marginTop: getSpacing(6),
})
