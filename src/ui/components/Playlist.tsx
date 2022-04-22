/* We use many `any` on purpose in this module, so we deactivate the following rule : */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent, useCallback, useMemo, useRef } from 'react'
import { FlatList, ListRenderItem, ListRenderItemInfo } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
type ItemDimensions = { width: number; height: number }

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

export const Playlist: FunctionComponent<Props> = ({
  data,
  itemWidth,
  itemHeight,
  testID,
  renderItem,
  keyExtractor,
  renderHeader,
  renderFooter,
  onEndReached,
}) => {
  const { isTouch } = useTheme()

  const flatListRef = useRef<FlatList>(null)

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

  const renderItemWithHeaderAndFooter: ListRenderItem<any> = useCallback(
    function ({ item, index, separators }) {
      if (renderHeader && index === 0) {
        return renderHeader({ height: itemHeight, width: itemWidth })
      }
      if (renderFooter && index === nbOfItems - 1) {
        return renderFooter({ height: itemHeight, width: itemWidth })
      }
      return renderItem({ item, index, separators, width: itemWidth, height: itemHeight })
    },
    [renderHeader, renderFooter, nbOfItems, renderItem, itemWidth, itemHeight]
  )

  return (
    <FlatListContainer>
      <FlatList
        testID={testID}
        ref={flatListRef}
        scrollEnabled={isTouch}
        data={dataWithHeaderAndFooter}
        renderItem={renderItemWithHeaderAndFooter}
        keyExtractor={keyExtractorWithHeaderAndFooter}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        horizontal={true}
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

const FlatListContainer = styled.View({ position: 'relative' })

const HorizontalMargin = styled.View({
  width: getSpacing(6),
})

const ITEM_SEPARATOR_WIDTH = getSpacing(4)
const ItemSeparatorComponent = styled.View({ width: ITEM_SEPARATOR_WIDTH })
