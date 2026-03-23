import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import styled from 'styled-components/native'

import { AdviceCard } from 'features/advices/components/AdviceCard/AdviceCard'
import { AdviceCardData, AdviceCardListProps } from 'features/advices/types'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { getSpacing } from 'ui/theme'

export const SEPARATOR_DEFAULT_VALUE = 2

const keyExtractor = (item: AdviceCardData) => item.id.toString()

export const AdviceCardListBase = forwardRef<
  Partial<FlatList<AdviceCardData>>,
  AdviceCardListProps
>(function AdviceCardListBase(
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
    onSeeMoreButtonPress,
    onLayout,
    shouldTruncate,
    cardIcon,
    tag,
  },
  ref
) {
  const listRef = useRef<FlatList>(null)

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
    scrollToIndex: (params) => listRef.current?.scrollToIndex(params),
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

  const renderItem = useCallback<ListRenderItem<AdviceCardData>>(
    ({ item }) => {
      return (
        <AdviceCard
          icon={cardIcon}
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          date={item.date}
          tag={tag}
          cardWidth={cardWidth}
          shouldTruncate={shouldTruncate}
          tagProps={item.tagProps}
          image={item.image}
          headerNavigateTo={item.headerNavigateTo}
          headerAccessibilityLabel={item.headerAccessibilityLabel}>
          {onSeeMoreButtonPress ? (
            <View>
              <Button
                wording="Voir plus"
                accessibilityLabel={`Voir plus à propos de ${item.title}`}
                onPress={() => onSeeMoreButtonPress(item.id)}
                variant="tertiary"
                color="neutral"
                size="small"
                icon={PlainMore}
                iconPosition="left"
              />
            </View>
          ) : null}
        </AdviceCard>
      )
    },
    [cardIcon, tag, cardWidth, shouldTruncate, onSeeMoreButtonPress]
  )

  return (
    <FlatList
      ref={listRef}
      data={data}
      style={style}
      ListHeaderComponent={headerComponent}
      renderItem={renderItem}
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
      testID="advice-list"
      onLayout={onLayout}
    />
  )
})
