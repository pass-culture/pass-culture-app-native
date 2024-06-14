import { isSameDay } from 'date-fns'
import React, { FunctionComponent, useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { FlatList, Animated, Easing } from 'react-native'

import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { filterOffersStocks } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { getDates } from 'shared/date/getDates'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
}

const useMoviesScreeningsList = (offerIds: number[]) => {
  const dates = getDates(new Date(), 15)
  const [selectedDate, setSelectedInternalDate] = useState<Date>(dates[0])
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const setSelectedDate = useCallback(
    (date: Date) => {
      if (!isSameDay(selectedDate, date)) {
        setSelectedInternalDate(date)
      }
    },
    [selectedDate]
  )

  const filteredOffersWithStocks = useMemo(
    () => filterOffersStocks(offersWithStocks || { offers: [] }, selectedDate),
    [offersWithStocks, selectedDate]
  )

  return { dates, selectedDate, setSelectedDate, offersWithStocks: filteredOffersWithStocks }
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const flatListRef = useRef<FlatList | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(0)).current
  const [width, setWidth] = useState<number>(0)

  const {
    dates: nextFifteenDates,
    selectedDate,
    setSelectedDate,
    offersWithStocks,
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
      const length = offersWithStocks?.offers.length ?? 0

      return index === length - 1
    },
    [offersWithStocks?.offers.length]
  )

  return (
    <React.Fragment>
      <MovieCalendar
        dates={nextFifteenDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        flatListRef={flatListRef}
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
        <FlatList
          data={offersWithStocks?.offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <MovieOfferTile
              offer={item}
              venueOffers={venueOffers}
              date={selectedDate}
              isLast={getIsLast(index)}
            />
          )}
        />
      </Animated.View>
    </React.Fragment>
  )
}
