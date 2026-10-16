import React, { FunctionComponent, memo, useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { FavoriteOfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { FavoritesList } from 'features/favorites/components/FavoritesList'
import { FavoritesResultsPlaceholder } from 'features/favorites/components/FavoritesResultsPlaceholder'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { SortButton } from 'features/favorites/components/SortButton'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { applySortBy } from 'features/favorites/helpers/applySortBy'
import { useFavoritesQuery } from 'features/favorites/queries'
import { Tab } from 'features/favorites/types'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { LocationMode } from 'libs/location/types'
import { useLocationConfiguration } from 'libs/locationV2/location.store'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

const ANIMATION_DURATION = 700

const UnmemoizedFavoritesResults: FunctionComponent = () => {
  const [offerToBook, setOfferToBook] = useState<FavoriteOfferResponse | null>(null)
  const { sortBy } = useFavoritesState()
  const { geolocation: position } = useLocationConfiguration(LocationMode.AROUND_ME)
  const { data, isLoading, isFetching, refetch } = useFavoritesQuery()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.OFFERS)
  const sortedFavorites = useMemo(
    () => applySortBy(data?.favorites ?? [], sortBy, position),
    [data?.favorites, sortBy, position]
  )
  const { user } = useAuthContext()

  if (showSkeleton) return <FavoritesResultsPlaceholder />

  const tabPanels = {
    [Tab.OFFERS]: (
      <FavoritesList
        isRefreshing={isRefreshing}
        onBookOffer={setOfferToBook}
        onRefresh={refetch}
        favorites={sortedFavorites}
        selectedTab={enableFavoritesHub ? selectedTab : undefined}
        sortBy={sortBy}
        user={user}
      />
    ),
    [Tab.VENUES]: <ListEmptyComponent />,
    [Tab.ARTISTS]: <ListEmptyComponent />,
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
            onTabChange={setSelectedTab}
          />
        ) : (
          tabPanels[Tab.OFFERS]
        )}
      </Container>
    </React.Fragment>
  )
}

export const FavoritesResults = memo(UnmemoizedFavoritesResults)

const ListEmptyComponent = () => (
  <EmptyComponentContainer>
    <NoFavoritesResult />
  </EmptyComponentContainer>
)

const Container = styled.View<{ enableFavoritesHub?: boolean }>(
  ({ theme, enableFavoritesHub }) => ({
    flex: 1,
    marginTop: enableFavoritesHub ? theme.designSystem.size.spacing.xl : undefined,
  })
)

const EmptyComponentContainer = styled.View(({ theme }) => ({
  flex: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + theme.designSystem.size.spacing.l,
}))
