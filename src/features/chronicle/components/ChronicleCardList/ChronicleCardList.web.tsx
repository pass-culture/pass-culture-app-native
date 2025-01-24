import React, { FunctionComponent, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
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
}) => {
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()

  const listRef = useRef<FlatList>(null)

  const {
    onScroll,
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

  return (
    <FlatListContainer onLayout={onContainerLayout}>
      {horizontal ? (
        <React.Fragment>
          {isStart ? null : (
            <PlaylistArrowButton
              direction="left"
              onPress={handleScrollPrevious}
              testID="chronicle-list-left-arrow"
            />
          )}

          {isEnd ? null : (
            <PlaylistArrowButton
              direction="right"
              onPress={handleScrollNext}
              testID="chronicle-list-right-arrow"
            />
          )}
        </React.Fragment>
      ) : null}
      <ChronicleCardListBase
        data={data}
        ref={listRef}
        horizontal={horizontal}
        cardWidth={cardWidth}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        headerComponent={headerComponent}
        separatorSize={separatorSize}
        contentContainerStyle={contentContainerStyle}
        snapToInterval={isDesktopViewport ? CHRONICLE_CARD_WIDTH : undefined}
      />
    </FlatListContainer>
  )
}

const FlatListContainer = styled.View<{ minHeight?: number }>({
  position: 'relative',
  width: '100%',
})
