import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { ListOnScrollProps, VariableSizeList } from 'react-window'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { RowData, SearchListItem } from 'features/search/components/SearchListItem.web'
import { LIST_ITEM_HEIGHT } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useScrollToBottomOpacity } from 'features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity'
import { SearchListProps } from 'features/search/types'
import { useLocation } from 'libs/geolocation'
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

function getHeaderSize(
  userData: Record<'message', string>[] | undefined,
  isGeolocated: boolean,
  venuesCount: number
) {
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
  userData: any
) {
  if (index === 0) {
    return getHeaderSize(userData, isGeolocated, venuesCount)
  }

  // Last index means we want to draw the Footer.
  if (index === itemsCount - 1) {
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
    const { isGeolocated } = useLocation()
    const { searchState } = useSearch()

    /**
     * This method will compute maximum height to set list height programatically.
     */
    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setAvailableHeight(event.nativeEvent.layout.height)
    }, [])

    const handleScroll = useCallback(
      (props: ListOnScrollProps) => {
        if (outerListRef.current && autoScrollEnabled) {
          const { scrollTop, scrollHeight, clientHeight } = outerListRef.current

          const isNearToBottom = scrollTop + clientHeight >= scrollHeight - LOAD_MORE_THRESHOLD

          if (isNearToBottom && !isFetchingNextPage) {
            onEndReached?.()
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
      items: [{}, ...hits.offers, {}],
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
      () => JSON.stringify({ isGeolocated, nbHits, autoScrollEnabled, onPress }),
      [isGeolocated, nbHits, autoScrollEnabled, onPress]
    )

    return (
      <RootContainer onLayout={onLayout} testID="searchResultsFlatlist">
        {nbHits ? (
          <React.Fragment>
            <VariableSizeList
              ref={listRef}
              key={rerenderKey}
              innerElementType="ul"
              itemData={data}
              itemSize={(index) =>
                getItemSize(index, hits.venues.length, isGeolocated, data.items.length, userData)
              }
              height={availableHeight}
              itemCount={data.items.length}
              outerRef={outerListRef}
              onScroll={handleScroll}
              width="100%">
              {SearchListItem}
            </VariableSizeList>
          </React.Fragment>
        ) : (
          <NoSearchResult />
        )}
      </RootContainer>
    )
  }
)

SearchList.displayName = 'SearchListWeb'

const RootContainer = styled(View)({
  flex: 1,
})
