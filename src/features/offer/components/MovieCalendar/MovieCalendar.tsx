import React from 'react'
import { FlatList, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { MovieCalendarBottomBar } from 'features/offer/components/MovieCalendar/components/MovieCalendarBottomBar'
import { MovieCalendarDay } from 'features/offer/components/MovieCalendar/components/MovieCalendarDay'
import { useDraggableScroll } from 'features/offer/components/MovieCalendar/hooks/useDraggableScroll'
import { useHorizontalFlatListScroll } from 'features/offer/components/MovieCalendar/hooks/useHorizontalFlatListScroll'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'
import { BicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { getSpacing } from 'ui/theme'

type Props = {
  dates: Date[]
  selectedDate: Date | undefined
  onTabChange: (date: Date) => void
  flatListRef: React.MutableRefObject<FlatList | null>
}

export const MovieCalendar: React.FC<Props> = ({
  dates,
  selectedDate,
  onTabChange,
  flatListRef,
}) => {
  const { isDesktopViewport } = useTheme()
  const {
    handleScrollPrevious,
    handleScrollNext,
    onScroll,
    onContentSizeChange,
    onContainerLayout,
    isEnd,
    isStart,
  } = useHorizontalFlatListScroll({ ref: flatListRef, isActive: isDesktopViewport })
  const { refs } = useDraggableScroll({ outerRef: flatListRef })
  return (
    <View onLayout={onContainerLayout}>
      <MovieCalendarBottomBar />
      {isDesktopViewport && !isStart ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="left"
          onPress={handleScrollPrevious}
          testID="movie-calendar-left-arrow">
          <BicolorArrowLeft />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      <View>
        <FlatList
          ref={refs}
          data={dates}
          horizontal
          contentContainerStyle={flatListContainer}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          testID="movie-calendar-flat-list"
          renderItem={({ item: date }) => (
            <MovieCalendarDay date={date} selectedDate={selectedDate} onTabChange={onTabChange} />
          )}
        />
        {isDesktopViewport ? <FadeLeft /> : null}
        {isDesktopViewport ? <FadeRight /> : null}
      </View>
      {isDesktopViewport && !isEnd ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="right"
          onPress={handleScrollNext}
          testID="movie-calendar-right-arrow">
          <BicolorArrowRight />
        </ScrollButtonForNotTouchDevice>
      ) : null}
    </View>
  )
}

const flatListContainer = {
  paddingHorizontal: getSpacing(6),
}

const FadeLeft = styled(LinearGradient).attrs({
  colors: ['white', 'transparent'],
  start: { x: 0.2, y: 0.5 },
  end: { x: 1, y: 0.5 },
})`
  position: absolute;
  top: 0;
  bottom: ${getSpacing(1)}px;
  left: -1px;
  width: ${getSpacing(20)}px;
`

const FadeRight = styled(LinearGradient).attrs({
  colors: ['transparent', 'white'],
  start: { x: 0, y: 0.5 },
  end: { x: 0.8, y: 0.5 },
})`
  position: absolute;
  top: 0;
  bottom: ${getSpacing(1)}px;
  right: -1px;
  width: ${getSpacing(20)}px;
`
