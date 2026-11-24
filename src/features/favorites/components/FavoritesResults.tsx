import React, { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import {
  FavoriteArtistResponse,
  FavoriteOfferResponse,
  FavoriteOfferResponseV2,
  FavoriteVenueResponse,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { FavoriteArtist } from 'features/favorites/components/FavoriteArtist'
import { FavoriteOffer } from 'features/favorites/components/FavoriteOffer'
import { FavoritesList } from 'features/favorites/components/FavoritesList'
import { FavoritesResultsPlaceholder } from 'features/favorites/components/FavoritesResultsPlaceholder'
import { FavoriteVenue } from 'features/favorites/components/FavoriteVenue'
import { SortButton } from 'features/favorites/components/SortButton'
import { FAVORITE_TYPE_BY_TAB } from 'features/favorites/constants'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { applySortBy } from 'features/favorites/helpers/applySortBy'
import { Tab } from 'features/favorites/types'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { LocationMode } from 'libs/location/types'
import { useLocationConfiguration } from 'libs/locationV2/location.store'
import {
  useArtistFavoritesQuery,
  useOfferFavoritesQuery,
  useVenueFavoritesQuery,
} from 'queries/favorites/useFavoritesQuery'
import { getAvailableCredit } from 'shared/user/getAvailableCredit'
import { FavoriteHitPlaceholder } from 'ui/components/placeholders/Placeholders'

const ANIMATION_DURATION = 700

const UnmemoizedFavoritesResults: FunctionComponent = () => {
  const [offerToBook, setOfferToBook] = useState<FavoriteOfferResponse | null>(null)
  const { sortBy } = useFavoritesState()
  const { geolocation: position } = useLocationConfiguration(LocationMode.AROUND_ME)
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const {
    data: offerFavorites,
    isLoading: isLoadingOfferFavorites,
    isFetching: isFetchingOfferFavorites,
    refetch: refetchOfferFavorites,
  } = useOfferFavoritesQuery()
  const {
    data: artistFavorites,
    isLoading: isLoadingArtistFavorites,
    isFetching: isFetchingArtistFavorites,
    refetch: refetchArtistFavorites,
  } = useArtistFavoritesQuery({ enabled: enableFavoritesHub })
  const {
    data: venueFavorites,
    isLoading: isLoadingVenueFavorites,
    isFetching: isFetchingVenueFavorites,
    refetch: refetchVenueFavorites,
  } = useVenueFavoritesQuery({ enabled: enableFavoritesHub })

  const showOffersSkeleton = useIsFalseWithDelay(isLoadingOfferFavorites, ANIMATION_DURATION)
  const isOffersRefreshing = useIsFalseWithDelay(isFetchingOfferFavorites, ANIMATION_DURATION)
  const showVenuesSkeleton = useIsFalseWithDelay(isLoadingVenueFavorites, ANIMATION_DURATION)
  const isVenuesRefreshing = useIsFalseWithDelay(isFetchingVenueFavorites, ANIMATION_DURATION)
  const showArtistsSkeleton = useIsFalseWithDelay(isLoadingArtistFavorites, ANIMATION_DURATION)
  const isArtistsRefreshing = useIsFalseWithDelay(isFetchingArtistFavorites, ANIMATION_DURATION)

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.OFFERS)
  const sortedFavorites = useMemo(
    () => applySortBy(offerFavorites?.favorites ?? [], sortBy, position),
    [offerFavorites?.favorites, sortBy, position]
  )
  const { user, isLoggedIn } = useAuthContext()

  const credit = getAvailableCredit(user)

  useEffect(
    function logConsultFavoritesOnOffersTab() {
      if (isLoggedIn) {
        void analytics.logConsultFavorites({ tab: FAVORITE_TYPE_BY_TAB[Tab.OFFERS] })
      }
    },
    [isLoggedIn]
  )

  const renderOffer = useCallback<ListRenderItem<FavoriteOfferResponseV2>>(
    ({ item }) => {
      if (!user || !credit) return <FavoriteHitPlaceholder />
      return <FavoriteOffer favorite={item} user={user} onInAppBooking={setOfferToBook} />
    },
    [user, credit]
  )

  const renderVenue = useCallback<ListRenderItem<FavoriteVenueResponse>>(
    ({ item }) => <FavoriteVenue favorite={item} />,
    []
  )

  const renderArtist = useCallback<ListRenderItem<FavoriteArtistResponse>>(
    ({ item }) => <FavoriteArtist favorite={item} />,
    []
  )

  const handleOnTabChange = useCallback((tab: Tab) => {
    setSelectedTab(tab)
    void analytics.logConsultFavorites({ tab: FAVORITE_TYPE_BY_TAB[tab] })
  }, [])

  const tabPanels = {
    [Tab.OFFERS]: showOffersSkeleton ? (
      <FavoritesResultsPlaceholder />
    ) : (
      <FavoritesList
        favorites={sortedFavorites}
        renderItem={renderOffer}
        sortBy={sortBy}
        isRefreshing={isOffersRefreshing}
        onRefresh={refetchOfferFavorites}
        selectedTab={selectedTab}
        enableFavoritesHub={enableFavoritesHub}
      />
    ),
    [Tab.VENUES]: showVenuesSkeleton ? (
      <FavoritesResultsPlaceholder />
    ) : (
      <FavoritesList
        favorites={venueFavorites?.favorites}
        renderItem={renderVenue}
        isRefreshing={isVenuesRefreshing}
        onRefresh={refetchVenueFavorites}
        selectedTab={selectedTab}
        enableFavoritesHub={enableFavoritesHub}
      />
    ),
    [Tab.ARTISTS]: showArtistsSkeleton ? (
      <FavoritesResultsPlaceholder />
    ) : (
      <FavoritesList
        favorites={artistFavorites?.favorites}
        renderItem={renderArtist}
        isRefreshing={isArtistsRefreshing}
        onRefresh={refetchArtistFavorites}
        selectedTab={selectedTab}
        enableFavoritesHub={enableFavoritesHub}
      />
    ),
  }

  const tabs = [{ key: Tab.OFFERS }, { key: Tab.VENUES }, { key: Tab.ARTISTS }]
  const showSortButton = sortedFavorites.length > 0 && selectedTab === Tab.OFFERS

  return (
    <React.Fragment>
      {offerToBook ? (
        <BookingOfferModal
          visible
          dismissModal={() => setOfferToBook(null)}
          offerId={offerToBook.id}
        />
      ) : null}
      {showSortButton ? <SortButton /> : null}

      <Container enableFavoritesHub={enableFavoritesHub}>
        {enableFavoritesHub ? (
          <TabLayout
            accessibilityLabel="Types de favoris"
            tabPanels={tabPanels}
            tabs={tabs}
            defaultTab={selectedTab}
            onTabChange={handleOnTabChange}
          />
        ) : (
          tabPanels[Tab.OFFERS]
        )}
      </Container>
    </React.Fragment>
  )
}

export const FavoritesResults = memo(UnmemoizedFavoritesResults)

const Container = styled.View<{ enableFavoritesHub?: boolean }>(
  ({ theme, enableFavoritesHub }) => ({
    flex: 1,
    marginTop: enableFavoritesHub ? theme.designSystem.size.spacing.xl : undefined,
  })
)
