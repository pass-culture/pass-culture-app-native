import React, {
  ReactElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { getSpacing } from 'ui/theme'

import { ChronicleCard } from '../ChronicleCard/ChronicleCard'

export const SEPARATOR_DEFAULT_VALUE = 2

const keyExtractor = (item: ChronicleCardData) => item.id.toString()

export type ChronicleCardListProps = Pick<
  FlatListProps<ChronicleCardData>,
  | 'data'
  | 'contentContainerStyle'
  | 'horizontal'
  | 'snapToInterval'
  | 'onScroll'
  | 'onContentSizeChange'
> & {
  offset?: number
  cardWidth?: number
  separatorSize?: number
  headerComponent?: ReactElement
  style?: StyleProp<ViewStyle>
  shouldShowSeeMoreButton?: boolean
  offerId?: number
  selectedChronicle?: ChronicleCardData
}

const renderItem = ({
  item,
  cardWidth,
  shouldShowSeeMoreButton,
  offerId,
}: {
  item: ChronicleCardData
  cardWidth?: number
  shouldShowSeeMoreButton?: boolean
  offerId?: number
}) => {
  return (
    <ChronicleCard
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      description={item.description}
      date={item.date}
      cardWidth={cardWidth}
      navigateTo={{ screen: 'Chronicles', params: { offerId, chronicleId: item.id } }}
      shouldShowSeeMoreButton={shouldShowSeeMoreButton}
    />
  )
}

export const ChronicleCardListBase = forwardRef<
  Partial<FlatList<ChronicleCardData>>,
  ChronicleCardListProps
>(function ChronicleCardListBase(
  {
    data,
    offset,
    horizontal = true,
    cardWidth,
    contentContainerStyle,
    onScroll,
    snapToInterval,
    headerComponent,
    onContentSizeChange,
    style,
    separatorSize = SEPARATOR_DEFAULT_VALUE,
    shouldShowSeeMoreButton,
    offerId,
    selectedChronicle,
  },
  ref
) {
  const listRef = useRef<FlatList>(null)
  const [isFlatListReady, setIsFlatListReady] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [listHeight, setListHeight] = useState(1)
  const { top } = useSafeAreaInsets()
  const { appBarHeight } = useTheme()

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height)
  }

  const handleListLayout = (event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height)
    setIsFlatListReady(true)
  }

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
    scrollToItem: (params) => listRef.current?.scrollToItem(params),
  }))

  useEffect(() => {
    if (listRef.current && offset !== undefined) {
      listRef.current.scrollToOffset({ offset, animated: true })
    }
  }, [offset])

  useEffect(() => {
    if (listRef.current && isFlatListReady && !!selectedChronicle) {
      const flatListTop = top + appBarHeight + headerHeight
      const viewPosition = flatListTop / listHeight

      listRef.current.scrollToItem({
        item: selectedChronicle,
        animated: true,
        viewPosition,
      })
    }
  }, [appBarHeight, headerHeight, selectedChronicle, isFlatListReady, listHeight, top])

  const Separator = useMemo(
    () =>
      styled.View({
        width: horizontal ? getSpacing(separatorSize) : '100%',
        height: horizontal ? '100%' : getSpacing(separatorSize),
      }),
    [separatorSize, horizontal]
  )

  return (
    <FlatList
      ref={listRef}
      data={data}
      style={style}
      ListHeaderComponent={
        headerComponent ? <View onLayout={handleHeaderLayout}>{headerComponent}</View> : null
      }
      renderItem={({ item }) => renderItem({ item, cardWidth, shouldShowSeeMoreButton, offerId })}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={contentContainerStyle}
      onContentSizeChange={onContentSizeChange}
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={100}
      horizontal={horizontal}
      decelerationRate="fast"
      snapToInterval={snapToInterval}
      testID="chronicle-list"
      onLayout={handleListLayout}
    />
  )
})
