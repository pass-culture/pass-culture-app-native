import React from 'react'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import type { VenueOffers, VenueOffersArtists } from 'features/venue/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { Spacer } from 'ui/theme'

export interface VenueOffersProps {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffers
  playlists?: GtlPlaylistData[]
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
}

const LoadingState: React.FC = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
  </React.Fragment>
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
}: Readonly<VenueOffersProps>) {
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const { isLoading: areVenueOffersLoading } = useVenueOffers({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({
    venue,
    queryKey: 'VENUE_GTL_PLAYLISTS',
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
    />
  )
}
