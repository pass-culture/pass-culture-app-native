import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ViewToken } from 'react-native'
import styled from 'styled-components/native'

import { ReactionTypeEnum, SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { AdviceCardData } from 'features/advices/types'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import type { VenueOffers, VenueOffersArtists } from 'features/venue/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { useUserLocation, useLocationMode } from 'libs/locationV2/location.store'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'

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
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
  advicesCardData?: AdviceCardData[]
  nbAdvices: number
  onShowWritersModal: () => void
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
  onViewableItemsChanged,
  advicesCardData,
  nbAdvices,
  onShowWritersModal,
}: Readonly<VenueOffersProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
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
  const shouldDisplayAdvicesSection = advicesCardData && advicesCardData.length > 0 && nbAdvices > 0

  const onPressAdviceCardSeeMore = (offerId: number) => {
    void analytics.logConsultAdvice({
      from: 'venue',
      offerId: offerId.toString(),
      venueId: venue.id.toString(),
      originDetails: 'Les avis des pros',
      adviceType: 'pro',
    })
    navigate('ProAdvicesVenue', { venueId: venue.id, offerId })
  }

  const onPressAllAdvicesButton = () => {
    void analytics.logConsultAdvice({
      from: 'venue',
      venueId: venue.id.toString(),
      originDetails: 'Lire les x avis',
      adviceType: 'pro',
    })
  }

  const onFeedbackLog = (type: ReactionTypeEnum) => {
    const feedbackResponse = type === ReactionTypeEnum.LIKE ? 'Oui' : 'Non'
    void analytics.logFeatureFeedbackClicked({
      featureName: 'pro_advices',
      feedbackResponse,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder isOpenToPublic={venue.isOpenToPublic} />
  }

  const hasAMovieScreeningOffer = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  if (hasAMovieScreeningOffer) {
    return (
      <React.Fragment>
        <VenueMovies venueOffers={venueOffers} />
        {shouldDisplayAdvicesSection ? (
          <VenueAdvicesSection
            advicesCardData={advicesCardData}
            nbAdvices={nbAdvices}
            venue={venue}
            onPressAdviceCardSeeMore={onPressAdviceCardSeeMore}
            onShowWritersModal={onShowWritersModal}
            onPressAllAdvicesButton={onPressAllAdvicesButton}
            onFeedbackLog={onFeedbackLog}
          />
        ) : null}
      </React.Fragment>
    )
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
      onViewableItemsChanged={onViewableItemsChanged}
      advicesCardData={advicesCardData}
      nbAdvices={nbAdvices}
      onShowWritersModal={onShowWritersModal}
      onPressAdviceCardSeeMore={onPressAdviceCardSeeMore}
      onPressAllAdvicesButton={onPressAllAdvicesButton}
      onFeedbackLog={onFeedbackLog}
    />
  )
}

const StyledOfferPlaylistSkeleton = styled(OfferPlaylistSkeleton)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
