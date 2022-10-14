/* We use many `any` on purpose in this module, so we deactivate the following rule : */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlashList, ListRenderItem, ListRenderItemInfo } from '@shopify/flash-list'
import range from 'lodash/range'
import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'
import { BicolorArrowLeft as DefaultBicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight as DefaultBicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { getSpacing } from 'ui/theme'
type ItemDimensions = { width: number; height: number }

type Direction = 'previous' | 'next'

export type RenderHeaderItem =
  | ((itemDimensions: ItemDimensions) => React.ReactElement<any>)
  | undefined
export type RenderFooterItem =
  | ((itemDimensions: ItemDimensions) => React.ReactElement<any>)
  | undefined
export type CustomListRenderItem<ItemT> = (
  info: ListRenderItemInfo<ItemT> & ItemDimensions
) => React.ReactElement | null

type Props = {
  data: any[]
  itemWidth: number
  itemHeight: number
  scrollButtonOffsetY?: number
  testID?: string
  renderItem: CustomListRenderItem<any>
  keyExtractor: (item: any, index: number) => string
  renderHeader?: RenderHeaderItem
  renderFooter?: RenderFooterItem
  onEndReached?: () => void
  children?: never
}

function defaultKeyExtractor(item: any, index: number): string {
  return item.key || item.id || index.toString()
}

const defaultProps = {
  keyExtractor: defaultKeyExtractor,
}

const isWeb = Platform.OS === 'web' ? true : undefined
type ListType<T> = T extends boolean ? FlatList : FlashList<any>

export const Playlist: FunctionComponent<Props> = ({
  data,
  itemWidth,
  itemHeight,
  scrollButtonOffsetY,
  testID,
  renderItem,
  keyExtractor,
  renderHeader,
  renderFooter,
  onEndReached,
}) => {
  const { isTouch } = useTheme()

  const [playlistWidth, setPlaylistWidth] = useState(0)
  const [playlistStepIndex, setPlaylistStepIndex] = useState(0)
  const listRef = useRef<ListType<typeof isWeb>>(null)

  // We use FlatLists in web because we don't have performance issues
  const ListComponent = isWeb ? FlatList : FlashList

  // We have to include these dummy objects for header and footer in the data array
  // in order to have the correct array length available for the scroll functions and renderItem
  // See also renderItemWithHeaderAndFooter(...)
  const dataWithHeaderAndFooter = useMemo(() => {
    if (renderHeader && renderFooter) return [{ dataHeader: true }, ...data, { dataFooter: true }]
    if (renderHeader) return [{ dataHeader: true }, ...data]
    if (renderFooter) return [...data, { dataFooter: true }]
    return data
  }, [data, renderHeader, renderFooter])

  const itemWidthWithOffset = itemWidth + ITEM_SEPARATOR_WIDTH
  const nbOfItems = dataWithHeaderAndFooter.length
  const { steps, nbOfSteps } = useMemo(
    () => getItemSteps(nbOfItems, itemWidthWithOffset, playlistWidth),
    [nbOfItems, itemWidthWithOffset, playlistWidth]
  )

  // It is required to know the exact width of an item width and its offset if we want to use
  // FlatList's scrollToIndex() function.
  function getItemLayout(_data: any[] | null | undefined, index: number) {
    return { length: itemWidth, offset: itemWidthWithOffset * index, index }
  }

  const keyExtractorWithHeaderAndFooter = useCallback(
    function (item: any, index: number) {
      if (renderHeader && index === 0) return 'playlist-data-header'
      if (renderFooter && index === nbOfItems - 1) return 'playlist-data-footer'
      return keyExtractor(item, index)
    },
    [renderHeader, renderFooter, keyExtractor, nbOfItems]
  )

  const displayItems = useCallback(
    function (direction: Direction) {
      setPlaylistStepIndex((previousStepIndex) => {
        if (!listRef.current) return previousStepIndex
        let stepIndex = 0
        if (direction === 'previous') stepIndex = Math.max(previousStepIndex - 1, 0)
        if (direction === 'next') stepIndex = Math.min(previousStepIndex + 1, nbOfSteps - 1)
        listRef.current.scrollToIndex({ index: steps[stepIndex], viewPosition: 0 })
        return stepIndex
      })
    },
    [nbOfSteps, steps]
  )

  const renderItemWithHeaderAndFooter: ListRenderItem<any> = useCallback(
    function ({ item, index }) {
      if (renderHeader && index === 0) {
        return renderHeader({ height: itemHeight, width: itemWidth })
      }
      if (renderFooter && index === nbOfItems - 1) {
        return renderFooter({ height: itemHeight, width: itemWidth })
      }
      return renderItem({
        item,
        index,
        width: itemWidth,
        height: itemHeight,
        target: 'Cell',
      })
    },
    [renderHeader, renderFooter, nbOfItems, renderItem, itemWidth, itemHeight]
  )

  const displayLeftScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex > 0
  const displayRightScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex < nbOfSteps - 1
  return (
    <FlatListContainer>
      {displayLeftScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="left"
          top={scrollButtonOffsetY}
          onPress={() => displayItems('previous')}>
          <BicolorArrowLeft />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      {displayRightScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="right"
          top={scrollButtonOffsetY}
          onPress={() => displayItems('next')}>
          <BicolorArrowRight />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      <ListComponent
        onLayout={({ nativeEvent }) => {
          setPlaylistWidth(nativeEvent.layout.width)
        }}
        testID={testID}
        ref={listRef}
        scrollEnabled={isTouch}
        drawDistance={useWindowDimensions().width / 4}
        estimatedItemSize={itemWidth}
        data={dataWithHeaderAndFooter}
        renderItem={renderItemWithHeaderAndFooter}
        keyExtractor={keyExtractorWithHeaderAndFooter}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        horizontal
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={HorizontalMargin}
        ListFooterComponent={HorizontalMargin}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      />
    </FlatListContainer>
  )
}

Playlist.defaultProps = defaultProps

function getItemSteps(nbOfItems: number, itemWidth: number, playlistWidth: number) {
  if (!nbOfItems || !itemWidth || !playlistWidth) {
    return { nbOfSteps: 1, steps: [0] }
  }
  const nbOfItemsDisplayed = Math.floor(playlistWidth / itemWidth)
  const steps = range(0, nbOfItems, nbOfItemsDisplayed)
  return { nbOfSteps: steps.length, steps }
}

const FlatListContainer = styled.View({
  position: 'relative',
  width: '100%',
})

const HorizontalMargin = styled.View({
  width: getSpacing(6),
})

const ITEM_SEPARATOR_WIDTH = getSpacing(4)
const ItemSeparatorComponent = styled.View({ width: ITEM_SEPARATOR_WIDTH })

const BicolorArrowLeft = styled(DefaultBicolorArrowLeft).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const BicolorArrowRight = styled(DefaultBicolorArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
