import { FlashList, FlashListRef } from '@shopify/flash-list'
import { differenceInCalendarDays } from 'date-fns'
import React, { Ref, useCallback } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
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
  listRef: Ref<FlashListRef<Date>> | null
  disabledDates?: Date[]
  listWidth?: number
  onFlatListLayout?: (event: LayoutChangeEvent) => void
  itemWidth?: number
  onItemLayout?: (event: LayoutChangeEvent) => void
}

export const MovieCalendar: React.FC<Props> = ({
  dates,
  selectedDate,
  onTabChange,
  listRef,
  listWidth,
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
  } = useHorizontalFlatListScroll({
    ref: listRef,
    isActive: isDesktopViewport,
  })

  const scrollToMiddleElement = useCallback(
    (currentIndex: number) => {
      if (!listWidth || !itemWidth) return
      const { offset } = handleMovieCalendarScroll(currentIndex, listWidth, itemWidth)

      if (listRef && 'current' in listRef) {
        listRef.current?.scrollToOffset({
          animated: true,
          offset,
        })
      }
    },
    [listRef, listWidth, itemWidth]
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
        <FlashList
          onLayout={onFlatListLayout}
          ref={listRef}
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

const FadeComponent = styled(LinearGradient)(
  ({ theme }) => `
  position: absolute;
  top: 0;
  bottom: ${theme.designSystem.size.spacing.xs}px;
  width: ${getSpacing(20)}px;
`
)

const FadeLeft = styled(FadeComponent).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.gradientMaximum,
    theme.designSystem.color.background.gradientMinimum,
  ],
  start: { x: 0.2, y: 0.5 },
  end: { x: 1, y: 0.5 },
}))`
  left: -1px;
`

const FadeRight = styled(FadeComponent).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.gradientMinimum,
    theme.designSystem.color.background.gradientMaximum,
  ],
  start: { x: 0, y: 0.5 },
  end: { x: 0.8, y: 0.5 },
}))`
  right: -1px;
`
