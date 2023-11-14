import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { FixedSizeList, ListOnScrollProps, VariableSizeList } from 'react-window'
import styled from 'styled-components/native'

import { VerticalUl } from 'ui/components/Ul'

import {
  OptimizedListData,
  OptimizedListItemStyle,
  OptimizedListProps,
  OptimizedListRef,
} from './types'

function getData<Item, AdditionalData>(
  items: Item[],
  additionalData: AdditionalData,
  hasHeader: boolean,
  hasFooter: boolean
): OptimizedListData<Item, AdditionalData> {
  const data = [...items]
  const headerPlaceholder = {} as const
  const footerPlaceholder = {} as const

  if (hasHeader) data.unshift(headerPlaceholder as Item)
  if (hasFooter) data.push(footerPlaceholder as Item)

  return { items: data, ...additionalData }
}

const InternalOptimizedList = <Item, AdditionalData>(
  {
    height,
    renderItem: renderItemProp,
    itemSize,
    additionalData,
    items,
    footerComponent: FooterComponent,
    headerComponent: HeaderComponent,
    onEndReached,
    endReachedThreshold = 0,
    testID,
    onScroll,
  }: Readonly<OptimizedListProps<Item, AdditionalData>>,
  ref: ForwardedRef<OptimizedListRef>
) => {
  const listRef = useRef<VariableSizeList>(null)
  const outerListRef = useRef<HTMLDivElement>(null)

  const [availableHeight, setAvailableHeight] = useState(height ?? 0)
  const [headerSize, setHeaderSize] = useState(0)
  const [footerSize, setFooterSize] = useState(0)

  const hasHeader = !!HeaderComponent
  const hasFooter = !!FooterComponent

  /**
   * Define data passed to list component.
   */
  const data = useMemo<OptimizedListData<Item, AdditionalData>>(
    () => getData(items, additionalData, hasHeader, hasFooter),
    [hasFooter, hasHeader, additionalData, items]
  )

  const itemCount = data.items.length

  /**
   * Override any ref methods, so we just expose `scrollToItem` method.
   */
  useImperativeHandle(ref, () => ({
    scrollToItem(itemIndex: number) {
      listRef.current?.scrollToItem(itemIndex)
    },
  }))

  /**
   * Method that is called to compute rendered item size.
   * Only used on `VariableSizeList` e.g. when a header and/or a footer are passed.
   */
  const getItemSize = useCallback(
    (index: number) => {
      const isHeader = index === 0 && hasHeader
      const isFooter = index === data.items.length - 1 && hasFooter

      if (isHeader) return headerSize
      if (isFooter) return footerSize

      return itemSize
    },
    [hasHeader, data.items.length, hasFooter, itemSize, headerSize, footerSize]
  )

  /**
   * This function is called every time an item should be rendered,
   * e.g. when the item is visible to the screen.
   *
   * It defines what is rendered for this item.
   */
  const renderItem = useCallback(
    (renderItemProps: {
      index: number
      style: CSSProperties
      data: OptimizedListData<Item, AdditionalData>
    }) => {
      const isHeader = renderItemProps.index === 0 && hasHeader
      const isFooter = renderItemProps.index === renderItemProps.data.items.length - 1 && hasFooter

      function onHeaderLayout(event: LayoutChangeEvent) {
        setHeaderSize(event.nativeEvent.layout.height)
        listRef.current?.resetAfterIndex(0)
      }

      function onFooterLayout(event: LayoutChangeEvent) {
        setFooterSize(event.nativeEvent.layout.height)
        listRef.current?.resetAfterIndex(data.items.length - 1)
      }

      if (isHeader) {
        return (
          <li style={renderItemProps.style}>
            <HeaderComponent onLayout={onHeaderLayout} />
          </li>
        )
      }

      if (isFooter) {
        return (
          <li style={renderItemProps.style}>
            <FooterComponent onLayout={onFooterLayout} />
          </li>
        )
      }

      return renderItemProp({
        ...renderItemProps,
        style: renderItemProps.style as OptimizedListItemStyle,
        item: renderItemProps.data.items[renderItemProps.index],
      })
    },
    [hasHeader, hasFooter, HeaderComponent, FooterComponent, renderItemProp, data.items.length]
  )

  /**
   * Called when list is rendered and defines its available height, e.g. the max height made
   * available by its parent.
   */
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!height) {
        setAvailableHeight(event.nativeEvent.layout.height)
      }
    },
    [height]
  )

  /**
   * Method that is called when list is being scrolled.
   * Trigger `onScroll` prop if given, and `onEndReached` method if given and reached bottom.
   */
  const handleScroll = useCallback(
    (scrollProps: ListOnScrollProps) => {
      if (onScroll) {
        onScroll(scrollProps.scrollOffset)
      }

      if (outerListRef.current && onEndReached) {
        const { scrollTop, scrollHeight, clientHeight } = outerListRef.current

        const scrollPositionFromTop = scrollTop + clientHeight
        const triggerPosition = scrollHeight - endReachedThreshold

        const isNearToBottom = scrollPositionFromTop >= triggerPosition

        if (isNearToBottom) {
          onEndReached()
        }
      }
    },
    [onScroll, onEndReached, endReachedThreshold]
  )

  return (
    <OptimizedListWrapper
      onLayout={onLayout}
      height={height}
      testID={testID ?? 'optimized-list-wrapper'}>
      {HeaderComponent || FooterComponent ? (
        <VariableSizeList
          ref={listRef}
          innerElementType={VerticalUl}
          itemData={data}
          itemSize={getItemSize}
          height={availableHeight}
          estimatedItemSize={itemSize}
          itemCount={itemCount}
          onScroll={handleScroll}
          outerRef={outerListRef}
          width="100%">
          {renderItem}
        </VariableSizeList>
      ) : (
        <FixedSizeList
          // Override ref type since we can't make it generic
          ref={listRef as ForwardedRef<FixedSizeList>}
          innerElementType={VerticalUl}
          itemData={data}
          itemSize={itemSize}
          height={availableHeight}
          itemCount={itemCount}
          onScroll={handleScroll}
          outerRef={outerListRef}
          width="100%">
          {renderItem}
        </FixedSizeList>
      )}
    </OptimizedListWrapper>
  )
}

const OptimizedListWrapper = styled(View)<{ height?: number }>(({ height }) => ({
  height: height ?? '100%',
}))

/**
 * OptimizedList is a component that allows you to render very large lists
 * without making browser crash.
 *
 * It internally uses `react-window` on web to allow us to virtualize lists,
 * so items that are no visible are not rendered.
 */
export const OptimizedList = forwardRef(InternalOptimizedList) as <Item, AdditionalData>(
  props: OptimizedListProps<Item, AdditionalData>,
  ref: ForwardedRef<OptimizedListRef>
) => ReactElement
