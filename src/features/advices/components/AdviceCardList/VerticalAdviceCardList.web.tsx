import React, { forwardRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { AdviceCardData, AdviceCardListProps } from 'features/advices/types'

import { AdviceCardListBase, SEPARATOR_DEFAULT_VALUE } from './AdviceCardListBase'

export const VerticalAdviceCardList = forwardRef<
  Partial<FlatList<AdviceCardData>>,
  AdviceCardListProps
>(function VerticalAdviceCardList(
  {
    data,
    cardWidth,
    contentContainerStyle,
    onScroll,
    ListFooterComponent,
    initialNumToRender,
    maxToRenderPerBatch,
    removeClippedSubviews,
    onContentSizeChange,
    headerComponent,
    style,
    separatorSize = SEPARATOR_DEFAULT_VALUE,
    onSeeMoreButtonPress,
    onLayout,
    shouldTruncate,
    cardIcon,
    tag,
    thumbnailHeight,
  },
  ref
) {
  return (
    <AdviceCardListBase
      data={data}
      ref={ref}
      horizontal={false}
      cardWidth={cardWidth}
      onScroll={onScroll}
      onContentSizeChange={onContentSizeChange}
      ListFooterComponent={ListFooterComponent}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      removeClippedSubviews={removeClippedSubviews}
      headerComponent={headerComponent}
      separatorSize={separatorSize}
      contentContainerStyle={contentContainerStyle}
      onSeeMoreButtonPress={onSeeMoreButtonPress}
      onLayout={onLayout}
      shouldTruncate={shouldTruncate}
      cardIcon={cardIcon}
      tag={tag}
      thumbnailHeight={thumbnailHeight}
      style={style}
    />
  )
})
