import React from 'react'
import { FlatList, View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { MovieCalendarBottomBar } from 'features/offer/components/MovieCalendar/MovieCalendarBottomBar'
import { MovieCalendarDay } from 'features/offer/components/MovieCalendar/MovieCalendarDay'
import { useHorizontalFlatListScroll } from 'features/offer/components/MovieCalendar/useHorizontalFlatListScroll'
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
      <FlatList
        ref={flatListRef}
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

const flatListContainer = { paddingHorizontal: getSpacing(6) }
