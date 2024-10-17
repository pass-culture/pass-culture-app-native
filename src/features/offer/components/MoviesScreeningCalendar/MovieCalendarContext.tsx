import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react'
import { Animated, View, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Easing } from 'react-native-reanimated'
import styled from 'styled-components/native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { handleMovieCalendarScroll } from 'features/offer/components/MoviesScreeningCalendar/utils'
import { useNextDays } from 'features/offer/helpers/useNextDays/useNextDays'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { useLayout } from 'ui/hooks/useLayout'

type MovieCalendarContextType = {
  selectedDate: Date
  goToDate: (date: Date) => void
}

const MovieCalendarContext = createContext<MovieCalendarContextType | undefined>(undefined)

const AnimatedCalendarView: React.FC<PropsWithChildren<{ selectedDate: Date }>> = ({
  selectedDate,
  children,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(0)).current
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    translateAnim.setValue(0)
    fadeAnim.setValue(0)
    Animated.timing(translateAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start()
  }, [fadeAnim, translateAnim, selectedDate])

  return (
    <AnimationContainer>
      <Animated.View
        onLayout={({ nativeEvent }) => {
          setWidth(nativeEvent.layout.width)
        }}
        style={{
          opacity: fadeAnim,
          transform: [
            { translateX: Animated.subtract(Animated.multiply(translateAnim, width), width) },
          ],
        }}>
        {children}
      </Animated.View>
    </AnimationContainer>
  )
}

export const MovieCalendarProvider: React.FC<{
  nbOfDays: number
  children: React.ReactNode
  containerStyle?: ViewStyle
}> = ({ nbOfDays, containerStyle, children }) => {
  const { dates, selectedDate, setSelectedDate } = useNextDays(nbOfDays)
  const flatListRef = useRef<FlatList | null>(null)
  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()
  const scrollToAnchor = useScrollToAnchor()

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

  const value = useMemo(() => ({ selectedDate, goToDate }), [selectedDate, goToDate])

  return (
    <MovieCalendarContext.Provider value={value}>
      <View style={containerStyle}>
        <Anchor name="movie-calendar">
          <MovieCalendar
            dates={dates}
            selectedDate={selectedDate}
            onTabChange={setSelectedDate}
            flatListRef={flatListRef}
            flatListWidth={flatListWidth}
            onFlatListLayout={onFlatListLayout}
            itemWidth={itemWidth}
            onItemLayout={onItemLayout}
          />
        </Anchor>
      </View>
      <AnimatedCalendarView selectedDate={selectedDate}>{children}</AnimatedCalendarView>
    </MovieCalendarContext.Provider>
  )
}

const AnimationContainer = styled.View({ overflow: 'hidden' })

export const useMovieCalendar = (): MovieCalendarContextType => {
  const context = useContext(MovieCalendarContext)
  if (context === undefined) {
    throw new Error('useMovieCalendar must be used within a MovieCalendarProvider')
  }
  return context
}
