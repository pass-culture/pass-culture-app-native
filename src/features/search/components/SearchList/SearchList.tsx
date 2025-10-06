import { FlashList, FlashListRef } from '@shopify/flash-list'
import React from 'react'
import { useTheme } from 'styled-components/native'

import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import {
  convertAlgoliaVenue2AlgoliaVenueOfferListItem,
  getReconciledVenues,
} from 'features/search/helpers/searchList/getReconciledVenues'
import { SearchListProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Offer } from 'shared/offer/types'
import { LineSeparator } from 'ui/components/LineSeparator'
import { getSpacing } from 'ui/theme'

const keyExtractor = (item: Offer) => item.objectID

export const SearchList = React.forwardRef<FlashListRef<Offer>, SearchListProps>(
  (
    {
      nbHits,
      hits,
      renderItem,
      autoScrollEnabled,
      refreshing,
      onRefresh,
      onEndReached,
      onScroll,
      userData,
      venuesUserData,
      artistSection,
      numColumns,
      isGridLayout,
      shouldDisplayGridList,
    },
    ref
  ) => {
    const { tabBar } = useTheme()
    const isEnabledVenuesFromOfferIndex = useFeatureFlag(
      RemoteStoreFeatureFlags.ENABLE_VENUES_FROM_OFFER_INDEX
    )

    return (
      <FlashList
        ref={ref}
        key={isGridLayout ? 'grid_search_results' : 'list_search_results'}
        testID="searchResultsFlashlist"
        data={hits.offers}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <SearchListHeader
            nbHits={nbHits}
            userData={userData}
            venues={
              isEnabledVenuesFromOfferIndex
                ? getReconciledVenues(hits.offers, hits.venues)
                : hits.venues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)
            }
            artistSection={artistSection}
            venuesUserData={venuesUserData}
            shouldDisplayGridList={shouldDisplayGridList}
          />
        }
        ItemSeparatorComponent={isGridLayout ? undefined : LineSeparator}
        renderItem={renderItem}
        numColumns={isGridLayout ? numColumns : undefined}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={autoScrollEnabled ? onEndReached : undefined}
        scrollEnabled={nbHits > 0}
        onScroll={onScroll}
        contentContainerStyle={{ paddingBottom: tabBar.height + getSpacing(10) }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    )
  }
)
SearchList.displayName = 'SearchList'
