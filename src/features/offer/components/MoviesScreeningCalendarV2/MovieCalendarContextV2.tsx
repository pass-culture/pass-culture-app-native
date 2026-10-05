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
import { useTheme } from 'styled-components'

import { MovieCalendarV2 } from 'features/offer/components/MovieCalendar/MovieCalendarV2'
import { handleMovieCalendarScroll } from 'features/offer/components/MoviesScreeningCalendar/helpers/handleMovieCalendarScroll'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { useLayout } from 'ui/hooks/useLayout'

type MovieCalendarContextV2Type = {
  selectedDate: string
  goToDate: (date: string) => void
  displayCalendar: (shouldDisplayCalendar: boolean) => void
  displayDates: (dates: string[]) => void
  disableDates: (dates: string[]) => void
  dates: string[]
}

const MovieCalendarContextV2 = createContext<MovieCalendarContextV2Type | undefined>(undefined)

export const MovieCalendarProviderV2: React.FC<{
  children: React.ReactNode
  containerStyle?: ViewStyle
  initialDates?: string[]
}> = ({ containerStyle, children, initialDates = [] }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDates?.[0] ?? formatDateToISOStringWithoutTime(new Date())
  )
  const [dates, setDates] = useState<string[]>(initialDates)
  const [disabledDates, setDisabledDates] = useState<string[]>([])
  const flatListRef = useRef<FlashListRef<string> | null>(null)
  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()
  const scrollToAnchor = useScrollToAnchor()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const { designSystem } = useTheme()
  const MOVIE_CALENDAR_PADDING = designSystem.size.spacing.xl
  const layoutRef = useRef({ flatListWidth, itemWidth })

  useEffect(() => {
    layoutRef.current = { flatListWidth, itemWidth }
  }, [flatListWidth, itemWidth])

  useEffect(() => {
    const currentIndex = dates.indexOf(selectedDate)

    const { offset } = handleMovieCalendarScroll(
      currentIndex,
      layoutRef.current.flatListWidth,
      layoutRef.current.itemWidth,
      MOVIE_CALENDAR_PADDING
    )

    flatListRef.current?.scrollToOffset({
      animated: true,
      offset,
    })
  }, [selectedDate, dates, MOVIE_CALENDAR_PADDING])

  useEffect(() => {
    if (flatListRef?.current) {
      flatListRef.current?.scrollToOffset({ offset: 0 })
    }
  }, [flatListRef])

  const goToDate = useCallback(
    (date: string) => {
      scrollToAnchor('movie-calendar')
      setSelectedDate(date)
    },
    [scrollToAnchor, setSelectedDate]
  )

  const displayDates = useCallback(
    (dates: string[]) => {
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
    <MovieCalendarContextV2.Provider value={value}>
      {isVisible ? (
        <View style={containerStyle}>
          <Anchor name={AnchorNames.MOVIE_CALENDAR}>
            <MovieCalendarV2
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
    </MovieCalendarContextV2.Provider>
  )
}

export const useMovieCalendarV2 = (): MovieCalendarContextV2Type => {
  const context = useContext(MovieCalendarContextV2)
  if (context === undefined) {
    throw new Error('useMovieCalendar must be used within a MovieCalendarProvider')
  }
  return context
}

export const useDisableCalendarDatesV2 = (dates: string[]) => {
  const context = useContext(MovieCalendarContextV2)
  if (context === undefined) {
    throw new Error('useDisableCalendarDates must be used within a MovieCalendarProvider')
  }

  useEffect(() => {
    context.disableDates(dates)
  }, [context, dates])
}

export const useDisplayCalendarV2 = (shouldDisplayCalendar: boolean) => {
  const context = useContext(MovieCalendarContextV2)
  if (context === undefined) {
    throw new Error('useDisplayCalendar must be used within a MovieCalendarProvider')
  }

  useEffect(() => {
    context.displayCalendar(shouldDisplayCalendar)
  }, [context, shouldDisplayCalendar])
}
