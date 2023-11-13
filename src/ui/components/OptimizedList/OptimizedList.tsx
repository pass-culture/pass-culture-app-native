import { FlashList } from '@shopify/flash-list'
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps'
import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import styled from 'styled-components/native'

import {
  OptimizedListItemStyle,
  OptimizedListProps,
  OptimizedListRef,
} from 'ui/components/OptimizedList/types'

function InternalOptimizedList<T, AD>(
  {
    height,
    renderItem: renderItemProp,
    items,
    footerComponent,
    headerComponent,
    itemSize,
    additionalData,
    testID,
    keyExtractor,
    refreshing,
    onRefresh,
    onEndReached,
    endReachedThreshold,
    onScroll,
  }: OptimizedListProps<T, AD>,
  ref: ForwardedRef<OptimizedListRef>
) {
  const listRef = useRef<FlashList<T>>(null)

  useImperativeHandle(ref, () => ({
    scrollToItem(itemIndex: number) {
      listRef.current?.scrollToIndex({
        index: itemIndex,
        animated: true,
      })
    },
  }))

  const renderItem = useCallback(
    (listRenderItemInfo: ListRenderItemInfo<T>) => {
      return renderItemProp({
        style: {} as OptimizedListItemStyle,
        index: listRenderItemInfo.index,
        item: listRenderItemInfo.item,
        data: {
          items,
          ...(listRenderItemInfo.extraData as AD),
        },
      })
    },
    [items, renderItemProp]
  )

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onScroll) {
        onScroll(event.nativeEvent.contentOffset.y)
      }
    },
    [onScroll]
  )

  return (
    <OptimizedListWrapper height={height}>
      <FlashList
        ListFooterComponent={footerComponent}
        ListHeaderComponent={headerComponent}
        data={items}
        estimatedItemSize={itemSize}
        extraData={additionalData}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        ref={listRef}
        refreshing={refreshing}
        renderItem={renderItem}
        testID={testID}
        onEndReached={onEndReached}
        onEndReachedThreshold={endReachedThreshold}
        onScroll={handleScroll}
      />
    </OptimizedListWrapper>
  )
}

const OptimizedListWrapper = styled(View)<{ height?: number }>(({ height }) => ({
  height: height ?? '100%',
}))

export const OptimizedList = forwardRef(InternalOptimizedList) as <T, AD>(
  props: OptimizedListProps<T, AD>,
  ref: ForwardedRef<FlashList<T>>
) => ReactElement
