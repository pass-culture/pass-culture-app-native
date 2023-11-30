import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import {
  LIST_ITEM_HEIGHT,
  SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_END,
  SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_START,
} from 'features/search/constants'
import { useScrollToBottomOpacity } from 'features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity'
import { SearchListProps } from 'features/search/types'
import { Offer } from 'shared/offer/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { OptimizedList } from 'ui/components/OptimizedList/OptimizedList'
import { OnLayoutProps, OptimizedListRef } from 'ui/components/OptimizedList/types'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'
import { getSpacing } from 'ui/theme'

const keyExtractor = (item: Offer) => item.objectID

export function SearchList({
  onEndReached,
  renderItem,
  autoScrollEnabled,
  nbHits,
  hits,
  refreshing,
  onRefresh,
  userData,
  venuesUserData,
  onPress,
  isFetchingNextPage,
}: SearchListProps) {
  const listRef = useRef<OptimizedListRef>(null)

  const handleScrollToTopPress = useCallback(() => {
    listRef.current?.scrollToItem(0)
  }, [])

  const { opacity, handleScroll: handleScrollOpacity } = useScrollToBottomOpacity()

  const handleScroll = useCallback(
    (scrollOffset: number) => {
      handleScrollOpacity({ scrollOffset })
    },
    [handleScrollOpacity]
  )

  const SearchListHeaderComponent = useCallback(
    ({ onLayout }: OnLayoutProps) => (
      <SearchListHeader
        nbHits={nbHits}
        userData={userData}
        venues={hits.venues}
        venuesUserData={venuesUserData}
        onLayout={onLayout}
      />
    ),
    [hits.venues, nbHits, userData, venuesUserData]
  )

  const SearchListFooterComponent = useCallback(
    ({ onLayout }: OnLayoutProps) => (
      <SearchListFooter
        isFetchingNextPage={isFetchingNextPage}
        autoScrollEnabled={autoScrollEnabled}
        nbHits={nbHits}
        nbLoadedHits={hits.offers?.length}
        onPress={onPress}
        onLayout={onLayout}
      />
    ),
    [autoScrollEnabled, hits.offers?.length, isFetchingNextPage, nbHits, onPress]
  )

  return nbHits > 0 ? (
    <React.Fragment>
      <OptimizedList
        ref={listRef}
        testID="searchResultsList"
        itemSize={LIST_ITEM_HEIGHT}
        items={hits.offers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        endReachedThreshold={LIST_ITEM_HEIGHT}
        onScroll={handleScroll}
        headerComponent={SearchListHeaderComponent}
        footerComponent={SearchListFooterComponent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <ScrollToTopContainer style={{ opacity }}>
        <Container onPress={handleScrollToTopPress}>
          <StyledLinearGradient
            start={SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_START}
            end={SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_END}>
            <ScrollToTopIcon />
          </StyledLinearGradient>
        </Container>
      </ScrollToTopContainer>
    </React.Fragment>
  ) : (
    <NoSearchResultsWrapper>
      <NoSearchResult />
    </NoSearchResultsWrapper>
  )
}

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})

const ScrollToTopContainer = styled(Animated.View)(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
  overflow: 'hidden',
  border: 0,
}))

const Container = styledButton(Touchable)({ overflow: 'hidden' })

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.primary, theme.colors.secondary],
}))(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: getSpacing(10),
  width: getSpacing(10),
}))

const ScrollToTopIcon = styled(ScrollToTop).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``
