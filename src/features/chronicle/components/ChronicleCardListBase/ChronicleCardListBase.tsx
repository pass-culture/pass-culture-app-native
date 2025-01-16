import React, { FunctionComponent, useEffect, useRef } from 'react'
import { FlatList } from 'react-native'

import {
  CHRONICLE_ITEM_WIDTH,
  ChronicleCard,
  ChronicleCardProps,
} from 'features/chronicle/components/ChronicleCard/ChronicleCard'
import { Spacer, getSpacing } from 'ui/theme'

const SEPARATOR_VALUE = 2
const keyExtractor = (item: ChronicleCardProps) => item.id.toString()

type ChronicleCardListProps = {
  data: ChronicleCardProps[]
  indexItem?: number
  horizontal?: boolean
}

const renderItem = ({ item }: { item: ChronicleCardProps }) => {
  return (
    <ChronicleCard
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      description={item.description}
      date={item.date}
    />
  )
}

export const ChronicleCardListBase: FunctionComponent<ChronicleCardListProps> = ({
  data,
  indexItem = 0,
  horizontal = true,
}) => {
  const listRef = useRef<FlatList>(null)

  const snapToOffsets = data.map((_, index) => CHRONICLE_ITEM_WIDTH * (index + 1))

  useEffect(() => {
    if (listRef.current && indexItem >= 0 && indexItem < data.length) {
      listRef.current.scrollToIndex({ index: indexItem, animated: true })
    }
  }, [data.length, indexItem])

  return (
    <FlatList
      ref={listRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={horizontal ? RowSeparator : ColumnSeparator}
      contentContainerStyle={contentContainerStyle}
      showsHorizontalScrollIndicator={false}
      horizontal={horizontal}
      decelerationRate="fast"
      snapToOffsets={snapToOffsets}
      getItemLayout={(_, index) => ({
        length: CHRONICLE_ITEM_WIDTH,
        offset: CHRONICLE_ITEM_WIDTH * index,
        index,
      })}
    />
  )
}

const contentContainerStyle = {
  paddingVertical: getSpacing(12),
}

const RowSeparator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} testID="row-separator" />
const ColumnSeparator = () => (
  <Spacer.Column numberOfSpaces={SEPARATOR_VALUE} testID="column-separator" />
)
