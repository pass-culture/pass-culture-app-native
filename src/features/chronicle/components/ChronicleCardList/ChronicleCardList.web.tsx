import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleCardData } from 'features/chronicle/type'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'

import {
  ChronicleCardListBase,
  ChronicleCardListProps,
  SEPARATOR_DEFAULT_VALUE,
} from './ChronicleCardListBase'

export const ChronicleCardList = forwardRef<
  Partial<FlatList<ChronicleCardData>>,
  ChronicleCardListProps
>(function ChronicleCardList(
  {
    data,
    horizontal = true,
    cardWidth,
    contentContainerStyle,
    onScroll,
    headerComponent,
    style,
    separatorSize = SEPARATOR_DEFAULT_VALUE,
    shouldShowSeeMoreButton,
    offerId,
    onLayout,
  },
  ref
) {
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()

  const listRef = useRef<FlatList>(null)

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
    scrollToIndex: (params) => listRef.current?.scrollToIndex(params),
  }))

  const {
    onScroll: internalScrollHandler,
    handleScrollNext,
    handleScrollPrevious,
    onContainerLayout,
    isEnd,
    isStart,
    onContentSizeChange,
  } = useHorizontalFlatListScroll({
    ref: listRef,
    scrollRatio: isDesktopViewport ? 1 : (cardWidth ?? CHRONICLE_CARD_WIDTH) / windowWidth,
  })

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    internalScrollHandler(event)
    onScroll?.(event)
  }

  return (
    <Container onLayout={onContainerLayout} style={style}>
      {horizontal && !isStart ? (
        <PlaylistArrowButton
          direction="left"
          onPress={handleScrollPrevious}
          testID="chronicle-list-left-arrow"
        />
      ) : null}

      {horizontal && !isEnd ? (
        <PlaylistArrowButton
          direction="right"
          onPress={handleScrollNext}
          testID="chronicle-list-right-arrow"
        />
      ) : null}

      <ChronicleCardListBase
        data={data}
        ref={listRef}
        horizontal={horizontal}
        cardWidth={cardWidth}
        onScroll={handleScroll}
        onContentSizeChange={onContentSizeChange}
        headerComponent={headerComponent}
        separatorSize={separatorSize}
        contentContainerStyle={contentContainerStyle}
        snapToInterval={isDesktopViewport ? CHRONICLE_CARD_WIDTH : undefined}
        offerId={offerId}
        shouldShowSeeMoreButton={shouldShowSeeMoreButton}
        onLayout={onLayout}
      />
    </Container>
  )
})

const Container = styled.View({
  justifyContent: 'center',
})
