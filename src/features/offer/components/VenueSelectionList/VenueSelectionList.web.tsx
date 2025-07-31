import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { VariableSizeList } from 'react-window'
import styled from 'styled-components/native'

import {
  VenueListItem,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import {
  RowData,
  VenueSelectionListItem,
} from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem.web'

const BASE_HEADER_HEIGHT = 96
const HEADER_HEIGHT_NOT_GEOLOCATED = 198
const LIST_ITEM_HEIGHT_NOT_GEOLOCATED = 100
const LIST_ITEM_HEIGHT_GEOLOCATED = 138
const LOAD_MORE_THRESHOLD = 300
const headerPlaceholder = {} as VenueListItem
const footerPlaceholder = {} as VenueListItem

type GetItemSizeType = {
  index: number
  isGeolocated: boolean
}

/**
 * Function called to compute row size.
 * Since the list contains header and footer components, it needs computation.
 */
function getItemSize({ index, isGeolocated }: GetItemSizeType) {
  const isHeader = index === 0

  if (isHeader && isGeolocated) {
    return BASE_HEADER_HEIGHT
  }

  if (isHeader && !isGeolocated) {
    return HEADER_HEIGHT_NOT_GEOLOCATED
  }

  if (!isGeolocated) {
    return LIST_ITEM_HEIGHT_NOT_GEOLOCATED
  }

  return LIST_ITEM_HEIGHT_GEOLOCATED
}

export const VenueSelectionList = forwardRef<never, VenueSelectionListProps>(
  (
    {
      items,
      nbLoadedHits,
      nbHits,
      selectedItem,
      onItemSelect,
      onEndReached,
      isFetchingNextPage,
      onPress,
      autoScrollEnabled,
      isSharingLocation,
      subTitle,
      headerMessage,
    },
    _ref
  ) => {
    const [availableHeight, setAvailableHeight] = useState(0)
    const outerListRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<VariableSizeList<RowData>>(null)

    /**
     * This method will compute maximum height to set list height programatically.
     */
    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setAvailableHeight(event.nativeEvent.layout.height)
    }, [])

    const handleScroll = useCallback(() => {
      if (outerListRef.current && autoScrollEnabled) {
        const { scrollTop, scrollHeight, clientHeight } = outerListRef.current

        const isNearToBottom = scrollTop + clientHeight >= scrollHeight - LOAD_MORE_THRESHOLD

        if (isNearToBottom && !isFetchingNextPage) {
          onEndReached()
        }
      }
    }, [autoScrollEnabled, isFetchingNextPage, onEndReached])

    /**
     * The rerender key is used to rerender the `VariableSizeList` component when important changes happen.
     * Be careful to not add too many things here since it will completely rerender the list, and so scroll to the top.
     */
    const rerenderKey = useMemo(
      () => JSON.stringify({ isGeolocated: isSharingLocation, nbHits, autoScrollEnabled, onPress }),
      [isSharingLocation, nbHits, autoScrollEnabled, onPress]
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
      items: [headerPlaceholder, ...items, footerPlaceholder],
      nbHits,
      isFetchingNextPage,
      autoScrollEnabled,
      onPress,
      isSharingLocation,
      subTitle,
      headerMessage,
      nbLoadedHits,
      selectedItem,
      onItemSelect,
    }

    const itemSizeFn = useCallback(
      (index: number) =>
        getItemSize({
          index,
          isGeolocated: isSharingLocation,
        }),
      [isSharingLocation]
    )

    return (
      <Container onLayout={onLayout} testID="venuesList">
        {/* @ts-expect-error - type incompatibility with React 19 */}
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
          {VenueSelectionListItem}
        </VariableSizeList>
      </Container>
    )
  }
)

const Container = styled(View)({
  flex: 1,
})

VenueSelectionList.displayName = 'VenueSelectionListWeb'
