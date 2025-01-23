import React, { FunctionComponent, useState } from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
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
  const [userOffset, setUserOffset] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [layout, setLayout] = useState<LayoutRectangle>()
  const [leftArrowVisible, setLeftArrowVisible] = useState(false)
  const [rightArrowVisible, setRightArrowVisible] = useState(true)

  const { isDesktopViewport } = useTheme()

  const pageWidth = isDesktopViewport ? layout?.width ?? 0 : CHRONICLE_CARD_WIDTH
  const goToPreviousPage = () => setUserOffset(Math.max(scrollOffset - pageWidth, 0))
  const goToNextPage = () => setUserOffset(scrollOffset + pageWidth)

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout)
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent
    const progress = contentOffset.x / (contentSize.width - layoutMeasurement.width)

    setScrollOffset(contentOffset.x)

    switch (progress) {
      case 0:
        setLeftArrowVisible(false)
        setRightArrowVisible(true)
        break
      case 1:
        setLeftArrowVisible(true)
        setRightArrowVisible(false)
        break
      default:
        setLeftArrowVisible(true)
        setRightArrowVisible(true)
    }
  }

  return (
    <FlatListContainer onLayout={handleLayout}>
      {horizontal ? (
        <React.Fragment>
          {leftArrowVisible ? (
            <PlaylistArrowButton
              direction="left"
              onPress={goToPreviousPage}
              testID="chronicle-list-left-arrow"
            />
          ) : null}

          {rightArrowVisible ? (
            <PlaylistArrowButton
              direction="right"
              onPress={goToNextPage}
              testID="chronicle-list-right-arrow"
            />
          ) : null}
        </React.Fragment>
      ) : null}
      <ChronicleCardListBase
        data={data}
        offset={userOffset}
        horizontal={horizontal}
        cardWidth={cardWidth}
        onScroll={handleScroll}
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
