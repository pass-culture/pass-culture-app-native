import { differenceInCalendarDays } from 'date-fns'
import React, { useCallback } from 'react'
import { FlatList, LayoutChangeEvent, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { MovieCalendarBottomBar } from 'features/offer/components/MovieCalendar/components/MovieCalendarBottomBar'
import { MovieCalendarDay } from 'features/offer/components/MovieCalendar/components/MovieCalendarDay'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'
import { getSpacing } from 'ui/theme'

import {
  handleMovieCalendarScroll,
  MOVIE_CALENDAR_PADDING,
} from '../MoviesScreeningCalendar/helpers/handleMovieCalendarScroll'

type Props = {
  dates: Date[]
  selectedDate: Date | undefined
  onTabChange: (date: Date) => void
  flatListRef: React.MutableRefObject<FlatList | null>
  disabledDates?: Date[]
  flatListWidth?: number
  onFlatListLayout?: (event: LayoutChangeEvent) => void
  itemWidth?: number
  onItemLayout?: (event: LayoutChangeEvent) => void
}

export const MovieCalendar: React.FC<Props> = ({
  dates,
  selectedDate,
  onTabChange,
  flatListRef,
  flatListWidth,
  onFlatListLayout,
  itemWidth,
  onItemLayout,
  disabledDates,
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

  const scrollToMiddleElement = useCallback(
    (currentIndex: number) => {
      if (!flatListWidth || !itemWidth) return
      const { offset } = handleMovieCalendarScroll(currentIndex, flatListWidth, itemWidth)

      flatListRef.current?.scrollToOffset({
        animated: true,
        offset,
      })
    },
    [flatListRef, flatListWidth, itemWidth]
  )

  const onInternalTabChange = useCallback(
    (date: Date) => {
      const currentIndex = differenceInCalendarDays(date, new Date())
      onTabChange(date)
      scrollToMiddleElement(currentIndex)
    },
    [onTabChange, scrollToMiddleElement]
  )

  return (
    <View onLayout={onContainerLayout}>
      <MovieCalendarBottomBar />
      {isDesktopViewport && !isStart ? (
        <PlaylistArrowButton
          direction="left"
          onPress={handleScrollPrevious}
          testID="movie-calendar-left-arrow"
        />
      ) : null}
      <View>
        <FlatList
          onLayout={onFlatListLayout}
          ref={flatListRef}
          data={dates}
          horizontal
          contentContainerStyle={contentContainerStyle}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          testID="movie-calendar-flat-list"
          renderItem={({ item: date }) => (
            <MovieCalendarDay
              onLayout={onItemLayout}
              date={date}
              selectedDate={selectedDate}
              onTabChange={onInternalTabChange}
              disabled={disabledDates?.includes(date)}
            />
          )}
        />
        {isDesktopViewport ? (
          <React.Fragment>
            <FadeLeft /> <FadeRight />
          </React.Fragment>
        ) : null}
      </View>
      {isDesktopViewport && !isEnd ? (
        <PlaylistArrowButton
          direction="right"
          onPress={handleScrollNext}
          testID="movie-calendar-right-arrow"
        />
      ) : null}
    </View>
  )
}

const contentContainerStyle = {
  paddingHorizontal: MOVIE_CALENDAR_PADDING,
}

const FadeComponent = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: ${getSpacing(1)}px;
  width: ${getSpacing(20)}px;
`

const FadeLeft = styled(FadeComponent).attrs(({ theme }) => ({
  //TODO(PC-36408): missing tokens transparent ?
  colors: [theme.designSystem.color.background.default, 'transparent'],
  start: { x: 0.2, y: 0.5 },
  end: { x: 1, y: 0.5 },
}))`
  left: -1px;
`

const FadeRight = styled(FadeComponent).attrs(({ theme }) => ({
  //TODO(PC-36408): missing tokens transparent ?
  colors: ['transparent', theme.designSystem.color.background.default],
  start: { x: 0, y: 0.5 },
  end: { x: 0.8, y: 0.5 },
}))`
  right: -1px;
`
