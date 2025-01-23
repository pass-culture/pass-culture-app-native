import React, { FunctionComponent, ReactElement, useEffect, useMemo, useRef } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { getSpacing } from 'ui/theme'

import { ChronicleCard } from '../ChronicleCard/ChronicleCard'

export const SEPARATOR_DEFAULT_VALUE = 2

const keyExtractor = (item: ChronicleCardData) => item.id.toString()

export type ChronicleCardListProps = {
  data: ChronicleCardData[]
  offset?: number
  horizontal?: boolean
  cardWidth?: number
  contentContainerStyle?: StyleProp<ViewStyle>
  snapToInterval?: number
  scrollEnabled?: boolean
  separatorSize?: number
  headerComponent?: ReactElement
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
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

export const ChronicleCardListBase: FunctionComponent<ChronicleCardListProps> = ({
  data,
  offset,
  horizontal = true,
  cardWidth,
  contentContainerStyle,
  onScroll,
  snapToInterval,
  scrollEnabled,
  headerComponent,
  separatorSize = SEPARATOR_DEFAULT_VALUE,
}) => {
  const listRef = useRef<FlatList>(null)

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
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={100}
      scrollEnabled={scrollEnabled}
      horizontal={horizontal}
      decelerationRate="fast"
      snapToInterval={snapToInterval}
      testID="chronicle-list"
    />
  )
}
