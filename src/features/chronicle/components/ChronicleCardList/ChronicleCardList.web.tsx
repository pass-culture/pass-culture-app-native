import colorAlpha from 'color-alpha'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
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
    onSeeMoreButtonPress,
    onLayout,
    shouldTruncate,
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
    <View onLayout={onContainerLayout} style={style}>
      {horizontal ? (
        <React.Fragment>
          <ArrowWrapper>
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
          </ArrowWrapper>
          {isDesktopViewport && !isEnd ? <GradientRight /> : null}
          {isDesktopViewport && !isStart ? <GradientLeft /> : null}
        </React.Fragment>
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
        onSeeMoreButtonPress={onSeeMoreButtonPress}
        onLayout={onLayout}
        shouldTruncate={shouldTruncate}
      />
    </View>
  )
})

const ArrowWrapper = styled.View.attrs({
  pointerEvents: 'box-none',
})({
  zIndex: 2,
  height: '100%',
  position: 'absolute',
  width: '100%',
  justifyContent: 'center',
})

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.default,
    colorAlpha(theme.designSystem.color.background.default, 0.7),
    colorAlpha(theme.designSystem.color.background.default, 0),
  ],

  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  pointerEvents: 'none',
}))({
  width: 100,
  height: '100%',
  position: 'absolute',
  zIndex: 1,
})

const GradientLeft = StyledLinearGradient
const GradientRight = styled(StyledLinearGradient)({ right: 0, transform: 'rotateZ(180deg)' })
