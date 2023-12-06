import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { ListOnScrollProps, VariableSizeList } from 'react-window'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import {
  footerPlaceholder,
  headerPlaceholder,
  RowData,
  SearchListItem,
} from 'features/search/components/SearchListItem.web'
import {
  LIST_ITEM_HEIGHT,
  SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_END,
  SCROLL_TO_TOP_BUTTON_LINEAR_GRADIENT_START,
} from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useScrollToBottomOpacity } from 'features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity'
import { SearchListProps } from 'features/search/types'
import { useLocation } from 'libs/location'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'
import { getSpacing } from 'ui/theme'

const BASE_HEADER_HEIGHT = 92
const USER_DATA_MESSAGE_HEIGHT = 72
const GEOLOCATION_BUTTON_HEIGHT = 102
const VENUES_PLAYLIST_HEIGHT = 265

const FOOTER_SIZE = 104
const LOAD_MORE_THRESHOLD = 300

type CustomUserData = Record<'message', string>[] | undefined

function getHeaderSize(userData: CustomUserData, isGeolocated: boolean, venuesCount: number) {
  let totalHeight = BASE_HEADER_HEIGHT

  if (userData?.[0]?.message) {
    totalHeight += USER_DATA_MESSAGE_HEIGHT
  } else if (!isGeolocated) {
    totalHeight += GEOLOCATION_BUTTON_HEIGHT
  }

  if (venuesCount) {
    totalHeight += VENUES_PLAYLIST_HEIGHT
  }

  return totalHeight
}

/**
 * Function called to compute row size.
 * Since the list contains header and footer components, it needs computation.
 */
function getItemSize(
  index: number,
  venuesCount: number,
  isGeolocated: boolean,
  itemsCount: number,
  userData: CustomUserData
) {
  const isHeader = index === 0
  const isFooter = index === itemsCount - 1

  if (isHeader) {
    return getHeaderSize(userData, isGeolocated, venuesCount)
  }

  if (isFooter) {
    return FOOTER_SIZE
  }

  return LIST_ITEM_HEIGHT
}

export const SearchList = forwardRef<never, SearchListProps>(
  (
    {
      nbHits,
      hits,
      autoScrollEnabled,
      isFetchingNextPage,
      onEndReached,
      onPress,
      userData,
      venuesUserData,
    },
    _ref
  ) => {
    const [availableHeight, setAvailableHeight] = useState(0)
    const outerListRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<VariableSizeList<RowData>>(null)
    const { hasGeolocPosition } = useLocation()
    const { searchState } = useSearch()

    /**
     * This method will compute maximum height to set list height programatically.
     */
    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setAvailableHeight(event.nativeEvent.layout.height)
    }, [])

    const { opacity, handleScroll: handleScrollOpacity } = useScrollToBottomOpacity()

    const handleScroll = useCallback(
      (props: ListOnScrollProps) => {
        handleScrollOpacity(props)

        if (outerListRef.current && autoScrollEnabled) {
          const { scrollTop, scrollHeight, clientHeight } = outerListRef.current

          const isNearToBottom = scrollTop + clientHeight >= scrollHeight - LOAD_MORE_THRESHOLD

          if (isNearToBottom && !isFetchingNextPage) {
            onEndReached()
          }
        }
      },
      [autoScrollEnabled, handleScrollOpacity, isFetchingNextPage, onEndReached]
    )

    /**
     * Data given to every search list items.
     */
    const data = {
      /**
       * This one in special since we manually add two empty objects.
       * The first one is used as a placeholder to place Header component.
       * The last one is used as a placeholder to place Footer component.
       *
       * This is necessary since the Row component (`SearchListItem.web`) is generic and we need to
       * guess what we want to draw.
       */
      items: [headerPlaceholder, ...hits.offers, footerPlaceholder],
      userData,
      venuesUserData,
      nbHits,
      offers: hits.offers,
      venues: hits.venues,
      isFetchingNextPage,
      autoScrollEnabled,
      onPress,
      searchState,
    }

    /**
     * The rerender key is used to rerender the `VariableSizeList` component when important changes happen.
     * Be careful to not add too many things here since it will completely rerender the list, and so scroll to the top.
     */
    const rerenderKey = useMemo(
      () => JSON.stringify({ isGeolocated: hasGeolocPosition, nbHits, autoScrollEnabled, onPress }),
      [hasGeolocPosition, nbHits, autoScrollEnabled, onPress]
    )

    const handleScrollToTopPress = useCallback(() => {
      listRef.current?.scrollToItem(0)
    }, [])

    const itemSizeFn = useCallback(
      (index: number) =>
        getItemSize(index, hits.venues.length, hasGeolocPosition, data.items.length, userData),
      [data.items.length, hits.venues.length, hasGeolocPosition, userData]
    )

    return (
      <SearchResultList onLayout={onLayout} testID="searchResultsList">
        {nbHits ? (
          <React.Fragment>
            <VariableSizeList
              ref={listRef}
              key={rerenderKey}
              innerElementType="ul"
              itemData={data}
              itemSize={itemSizeFn}
              height={availableHeight}
              itemCount={data.items.length}
              outerRef={outerListRef}
              onScroll={handleScroll}
              width="100%">
              {SearchListItem}
            </VariableSizeList>

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
          <NoSearchResult />
        )}
      </SearchResultList>
    )
  }
)

SearchList.displayName = 'SearchListWeb'

const SearchResultList = styled(View)({
  flex: 1,
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
