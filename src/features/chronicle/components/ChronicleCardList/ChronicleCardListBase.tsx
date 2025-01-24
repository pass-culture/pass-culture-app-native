import React, {
  ReactElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { FlatList, FlatListProps } from 'react-native'
import styled from 'styled-components/native'

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
}

const renderItem = ({ item, cardWidth }: { item: ChronicleCardData; cardWidth?: number }) => {
  return (
    <ChronicleCard
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      description={item.description}
      date={item.date}
      cardWidth={cardWidth}
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
    separatorSize = SEPARATOR_DEFAULT_VALUE,
  },
  ref
) {
  const listRef = useRef<FlatList>(null)

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
  }))

  useEffect(() => {
    if (listRef.current && offset !== undefined) {
      listRef.current.scrollToOffset({ offset, animated: true })
    }
  }, [offset])

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
      ListHeaderComponent={headerComponent}
      renderItem={({ item }) => renderItem({ item, cardWidth })}
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
    />
  )
})
