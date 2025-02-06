import React from 'react'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import type { VenueOffersArtists, VenueOffers } from 'features/venue/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  const { isLoading: areVenueOffersLoading } = useVenueOffers(venue)
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({
    venue,
    queryKey: 'VENUE_GTL_PLAYLISTS',
  })
  const isOfferAMovieScreening = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )
  const enableCine = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_VENUE)

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  if (isOfferAMovieScreening && enableCine) {
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
