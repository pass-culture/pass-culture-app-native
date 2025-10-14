import { FlashListRef } from '@shopify/flash-list'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react'
import { View, ViewStyle } from 'react-native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useDaysSelector } from 'features/offer/helpers/useDaysSelector/useDaysSelector'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { useLayout } from 'ui/hooks/useLayout'

import { handleMovieCalendarScroll } from './helpers/handleMovieCalendarScroll'

type MovieCalendarContextType = {
  selectedDate: Date
  goToDate: (date: Date) => void
  displayCalendar: (shouldDisplayCalendar: boolean) => void
  displayDates: (dates: Date[]) => void
  disableDates: (dates: Date[]) => void
  dates: Date[]
}

const MovieCalendarContext = createContext<MovieCalendarContextType | undefined>(undefined)

export const MovieCalendarProvider: React.FC<{
  children: React.ReactNode
  containerStyle?: ViewStyle
  initialDates?: Date[]
}> = ({ containerStyle, children, initialDates = [] }) => {
  const { dates, selectedDate, setSelectedDate, setDates } = useDaysSelector(initialDates)
  const [disabledDates, setDisabledDates] = useState<Date[]>([])
  const flatListRef = useRef<FlashListRef<Date> | null>(null)
  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()
  const scrollToAnchor = useScrollToAnchor()
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const scrollToMiddleElement = useCallback(
    (currentIndex: number) => {
      const { offset } = handleMovieCalendarScroll(currentIndex, flatListWidth, itemWidth)

      flatListRef.current?.scrollToOffset({
        animated: true,
        offset,
      })
    },
    [flatListRef, flatListWidth, itemWidth]
  )

  useEffect(() => {
    const currentIndex = dates.findIndex(
      (date) => (date as Date).toDateString() === selectedDate.toDateString()
    )

    scrollToMiddleElement(currentIndex)
  }, [selectedDate, dates, scrollToMiddleElement])

  useEffect(() => {
    if (flatListRef?.current) {
      flatListRef.current?.scrollToOffset({ offset: 0 })
    }
  }, [flatListRef])

  const goToDate = useCallback(
    (date: Date) => {
      scrollToAnchor('movie-calendar')
      setSelectedDate(date)
    },
    [scrollToAnchor, setSelectedDate]
  )

  const displayDates = useCallback(
    (dates: Date[]) => {
      setDates(dates)
    },
    [setDates]
  )

  const value = useMemo(
    () => ({
      dates,
      selectedDate,
      goToDate,
      displayCalendar: setIsVisible,
      displayDates,
      disableDates: setDisabledDates,
    }),
    [dates, selectedDate, goToDate, displayDates]
  )

  return (
    <MovieCalendarContext.Provider value={value}>
      {isVisible ? (
        <View style={containerStyle}>
          <Anchor name="movie-calendar">
            <MovieCalendar
              dates={dates}
              selectedDate={selectedDate}
              disabledDates={disabledDates}
              onTabChange={setSelectedDate}
              listRef={flatListRef}
              listWidth={flatListWidth}
              onFlatListLayout={onFlatListLayout}
              itemWidth={itemWidth}
              onItemLayout={onItemLayout}
            />
          </Anchor>
        </View>
      ) : null}
      {children}
    </MovieCalendarContext.Provider>
  )
}

export const useMovieCalendar = (): MovieCalendarContextType => {
  const context = useContext(MovieCalendarContext)
  if (context === undefined) {
    throw new Error('useMovieCalendar must be used within a MovieCalendarProvider')
  }
  return context
}

export const useDisableCalendarDates = (dates: Date[]) => {
  const context = useContext(MovieCalendarContext)
  if (context === undefined) {
    throw new Error('useDisableCalendarDates must be used within a MovieCalendarProvider')
  }

  useEffect(() => {
    context.disableDates(dates)
  }, [context, dates])
}

export const useDisplayCalendar = (shouldDisplayCalendar: boolean) => {
  const context = useContext(MovieCalendarContext)
  if (context === undefined) {
    throw new Error('useDisplayCalendar must be used within a MovieCalendarProvider')
  }

  useEffect(() => {
    context.displayCalendar(shouldDisplayCalendar)
  }, [context, shouldDisplayCalendar])
}
