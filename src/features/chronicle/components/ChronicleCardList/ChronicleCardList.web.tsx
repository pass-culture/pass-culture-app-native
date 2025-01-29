import React, { FunctionComponent, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'

import {
  ChronicleCardListBase,
  ChronicleCardListProps,
  SEPARATOR_DEFAULT_VALUE,
} from './ChronicleCardListBase'

export const ChronicleCardList: FunctionComponent<ChronicleCardListProps> = ({
  data,
  horizontal = true,
  cardWidth,
  contentContainerStyle,
  headerComponent,
  separatorSize = SEPARATOR_DEFAULT_VALUE,
  onScroll,
  style,
}) => {
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()

  const listRef = useRef<FlatList>(null)

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
      />
    </Container>
  )
}

const Container = styled.View({
  justifyContent: 'center',
})
