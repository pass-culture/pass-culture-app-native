import { isSameDay, startOfDay } from 'date-fns'
import React, { FunctionComponent, useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { FlatList, Animated, Easing } from 'react-native'

import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import {
  getNextMoviesByDate,
  MovieOffer,
} from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { getDates } from 'shared/date/getDates'
import { useLayout } from 'ui/hooks/useLayout'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
}

const useMoviesScreeningsList = (offerIds: number[]) => {
  const dates = getDates(new Date(), 15)
  const [selectedInternalDate, setSelectedInternalDate] = useState<Date>(dates[0])
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const setSelectedDate = useCallback(
    (date: Date) => {
      if (!isSameDay(selectedInternalDate, date)) {
        setSelectedInternalDate(startOfDay(date))
      }
    },
    [selectedInternalDate]
  )

  const moviesOffers: MovieOffer[] = useMemo(() => {
    const filteredOffersWithStocks = filterOffersStocksByDate(
      offersWithStocks?.offers || [],
      selectedInternalDate
    )
    const nextScreeningOffers = getNextMoviesByDate(
      offersWithStocks?.offers || [],
      selectedInternalDate
    )

    return [...filteredOffersWithStocks, ...nextScreeningOffers]
  }, [offersWithStocks?.offers, selectedInternalDate])

  return {
    dates,
    selectedDate: selectedInternalDate,
    setSelectedDate,
    moviesOffers,
  }
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()

  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const flatListRef = useRef<FlatList | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(0)).current
  const [width, setWidth] = useState<number>(0)
  const {
    dates: nextFifteenDates,
    selectedDate,
    setSelectedDate,
    moviesOffers,
  } = useMoviesScreeningsList(offerIds)

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

  const getIsLast = useCallback(
    (index: number) => {
      const length = moviesOffers.length ?? 0

      return index === length - 1
    },
    [moviesOffers.length]
  )

  const getNextDateIndex = useCallback(
    (nextDate: Date) => {
      return nextFifteenDates.findIndex(
        (date) => date.toISOString().split('T')[0] === nextDate.toISOString().split('T')[0]
      )
    },
    [nextFifteenDates]
  )

  return (
    <React.Fragment>
      <MovieCalendar
        dates={nextFifteenDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        flatListRef={flatListRef}
        flatListWidth={flatListWidth}
        onFlatListLayout={onFlatListLayout}
        itemWidth={itemWidth}
        onItemLayout={onItemLayout}
      />
      <Spacer.Column numberOfSpaces={4} />
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
        {moviesOffers.map((movie, index) => (
          <MovieOfferTile
            key={movie.offer.id}
            movieOffer={movie}
            venueOffers={venueOffers}
            date={selectedDate}
            isLast={getIsLast(index)}
            setSelectedDate={setSelectedDate}
            nextScreeningDate={movie.nextDate}
            nextDateIndex={movie.nextDate ? getNextDateIndex(movie.nextDate) : 0}
            flatListRef={flatListRef}
            flatListWidth={flatListWidth}
            itemWidth={itemWidth}
          />
        ))}
      </Animated.View>
    </React.Fragment>
  )
}
