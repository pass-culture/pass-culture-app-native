/* We use many `any` on purpose in this module, so we deactivate the following rule : */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import {
  FlatListProps,
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewabilityConfig,
  ViewStyle,
} from 'react-native'
import { FlatList, FlatList as RNGHFlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { PlaylistType } from 'features/offer/enums'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'
import { getSpacing } from 'ui/theme'

export type ItemDimensions = { width: number; height: number }

type RenderHeaderItem = ((itemDimensions: ItemDimensions) => React.ReactElement<any>) | undefined

export type RenderFooterItem =
  | ((itemDimensions: ItemDimensions) => React.ReactElement<any> | null)
  | undefined

export type CustomListRenderItem<ItemT> = (
  info: ListRenderItemInfo<ItemT> &
    ItemDimensions & {
      playlistType?: PlaylistType
    }
) => React.ReactElement | null

type Props = Pick<FlatListProps<unknown>, 'onViewableItemsChanged'> & {
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
  tileType?: 'offer' | 'venue' | 'video-module-offer'
  playlistType?: PlaylistType
  FlatListComponent?: typeof FlashList | typeof RNGHFlatList
  itemSeparatorSize?: number
  horizontalMargin?: number
  contentContainerStyle?: StyleProp<ViewStyle>
}

const isWeb = Platform.OS === 'web' ? true : undefined

const ITEM_SEPARATOR_WIDTH = getSpacing(4)
const HORIZONTAL_MARGIN = getSpacing(6)
const PLAYLIST_VIEWABILITY_CONFIG = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 20,
  minimumViewTime: 300,
} satisfies ViewabilityConfig

const InnerPlaylist = forwardRef<FlatList, Props>(function Playlist(props, ref) {
  const {
    data,
    itemWidth,
    itemHeight,
    scrollButtonOffsetY,
    testID,
    playlistType,
    renderItem,
    keyExtractor,
    renderHeader,
    renderFooter,
    onEndReached,
    onViewableItemsChanged,
    FlatListComponent = FlashList,
    tileType = 'offer',
    itemSeparatorSize = ITEM_SEPARATOR_WIDTH,
    horizontalMargin = HORIZONTAL_MARGIN,
    contentContainerStyle,
  } = props

  const { isTouch, tiles } = useTheme()
  const { width } = useWindowDimensions()

  const listRef = useRef<any>(null)
  const {
    handleScrollPrevious,
    handleScrollNext,
    onScroll,
    onContentSizeChange,
    onContainerLayout,
    isEnd,
    isStart,
  } = useHorizontalFlatListScroll({
    ref: listRef,
    isActive: isWeb,
  })

  useImperativeHandle(ref, () => listRef.current as FlatList)

  // We have to include these dummy objects for header and footer in the data array
  // in order to have the correct array length available for the scroll functions and renderItem
  // See also renderItemWithHeaderAndFooter(...)
  const dataWithHeaderAndFooter = useMemo(() => {
    if (renderHeader && renderFooter) return [{ dataHeader: true }, ...data, { dataFooter: true }]
    if (renderHeader) return [{ dataHeader: true }, ...data]
    if (renderFooter) return [...data, { dataFooter: true }]
    return data
  }, [data, renderHeader, renderFooter])

  const nbOfItems = dataWithHeaderAndFooter.length

  const keyExtractorWithHeaderAndFooter = useCallback(
    function (item: any, index: number) {
      if (renderHeader && index === 0) return 'playlist-data-header'
      if (renderFooter && index === nbOfItems - 1) return 'playlist-data-footer'
      return keyExtractor(item, index)
    },
    [renderHeader, renderFooter, keyExtractor, nbOfItems]
  )

  const renderItemWithHeaderAndFooter = useCallback(
    function ({ item, index = -1 }: { item: object; index: number }) {
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
        playlistType,
      })
    },
    [renderHeader, renderFooter, nbOfItems, renderItem, itemWidth, itemHeight, playlistType]
  )

  const MemoizedItemSeparatorComponent = useMemo(
    () => styled(ItemSeparatorComponent).attrs({ width: itemSeparatorSize })``,
    [itemSeparatorSize]
  )
  const MemoizedHorizontalMargin = useMemo(
    () => styled(HorizontalMargin).attrs({ width: horizontalMargin })``,
    [horizontalMargin]
  )

  const maxCaptionHeight =
    tileType === 'video-module-offer'
      ? tiles.maxCaptionHeight.videoModuleOffer
      : tiles.maxCaptionHeight[tileType]

  // To avoid a bug of cropped display on some home modules with Android, we need to add minHeigth to the FlashList Container
  const minHeight = Platform.OS === 'android' ? itemHeight + maxCaptionHeight : undefined

  const getItemLayout = useCallback(
    (data, index) => ({
      length: itemWidth,
      offset: (itemWidth + itemSeparatorSize) * index,
      index,
    }),
    [itemWidth, itemSeparatorSize]
  )

  return (
    <FlatListContainer onLayout={onContainerLayout} minHeight={minHeight}>
      {!isStart && isWeb ? (
        <PlaylistArrowButton
          direction="left"
          top={scrollButtonOffsetY}
          onPress={handleScrollPrevious}
        />
      ) : null}
      {!isEnd && isWeb ? (
        <PlaylistArrowButton
          direction="right"
          onPress={handleScrollNext}
          top={scrollButtonOffsetY}
        />
      ) : null}
      <FlatListComponent
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        testID={testID}
        ref={listRef}
        scrollEnabled={isTouch}
        drawDistance={width / 4}
        data={dataWithHeaderAndFooter}
        renderItem={renderItemWithHeaderAndFooter}
        keyExtractor={keyExtractorWithHeaderAndFooter}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        horizontal
        windowSize={7}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={MemoizedItemSeparatorComponent}
        ListHeaderComponent={MemoizedHorizontalMargin}
        ListFooterComponent={MemoizedHorizontalMargin}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        viewabilityConfig={PLAYLIST_VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={contentContainerStyle}
      />
    </FlatListContainer>
  )
})

export const Playlist = React.memo(InnerPlaylist)

const FlatListContainer = styled.View<{ minHeight?: number }>(({ minHeight }) => ({
  position: 'relative',
  width: '100%',
  minHeight,
}))

const HorizontalMargin = styled.View<{ width: number }>(({ width }) => ({
  width,
}))

const ItemSeparatorComponent = styled.View<{ width: number }>(({ width }) => ({ width }))
