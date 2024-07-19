import { isSameDay, startOfDay } from 'date-fns'
import React, {
  FunctionComponent,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react'
import { FlatList, Animated, Easing, Text, View } from 'react-native'

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
import { PortalProvider, usePortal } from 'ui/components/scrollViewWithContext/PortalProvider'
import { useOnScroll } from 'ui/components/scrollViewWithContext/ScrollContext'
import { useElementHeight } from 'ui/hooks/useElementHeight'
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

  return (
    <React.Fragment>
      <StickyContainer>
        <StickyElement>
          <MovieCalendar
            dates={nextFifteenDates}
            selectedDate={selectedDate}
            onTabChange={setSelectedDate}
            flatListRef={flatListRef}
          />
        </StickyElement>
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
            data={moviesOffers}
            keyExtractor={(item) => item.offer.id.toString()}
            renderItem={({ item, index }) => (
              <MovieOfferTile
                movieOffer={item}
                venueOffers={venueOffers}
                date={selectedDate}
                isLast={getIsLast(index)}
                setSelectedDate={setSelectedDate}
                nextScreeningDate={item.nextDate}
              />
            )}
          />
        </Animated.View>
      </StickyContainer>
    </React.Fragment>
  )
}

export enum STICKY_CONTAINER_ID {
  VENUE_CALENDAR = 'VENUE_CALENDAR',
}

export const StickyContainer: FC<PropsWithChildren<{ offset?: number }>> = ({
  offset,
  children,
}) => {
  return (
    <PortalProvider>
      <InnerStickyContainer>{children}</InnerStickyContainer>
    </PortalProvider>
  )
}

const InnerStickyContainer: FC<PropsWithChildren> = ({ children }) => {
  const { elements } = usePortal<{ position?: number }>()

  const nodes = useMemo(
    () =>
      elements
        .sort((a, b) => {
          if (!a.parameters.position || !b.parameters.position) {
            return 0
          }
          return a.parameters.position - b.parameters.position
        })
        .map((element) => <React.Fragment key={element.id}>{element.component}</React.Fragment>),
    [elements]
  )
  return (
    <React.Fragment>
      <View style={{ position: 'absolute' }}>{nodes}</View>
      {children}
    </React.Fragment>
  )
}

// pouvoir envoyer la position dans le portal
export const StickyElement: FC<PropsWithChildren<{ position?: number }>> = ({
  position,
  children,
}) => {
  const { addElement } = usePortal<{ position?: number }>()
  const { height, onLayout } = useElementHeight()
  useOnScroll(({ nativeEvent }) => {
    // comment savoir quand le scroll atteint l'élément?
    const scrollY = nativeEvent.contentOffset.y
    console.log({ scrollY })
  })
  const removePortal = useRef<() => void | null>()

  const setSticky = useCallback(() => {
    if (!removePortal) {
      return
    }
    removePortal.current = addElement(children, { position })
  }, [addElement, children, position])

  return removePortal ? <View style={{ height }} /> : <View onLayout={onLayout}>{children}</View>
}

const text = 'Hello'
const stickyElement1 = 'stickyElement1'
export const Main: FC = () => {
  return (
    <StickyContainer>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <StickyElement position={0}>
        <Text>{stickyElement1}</Text>
      </StickyElement>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
    </StickyContainer>
  )
}

// usePortal doit prendre en paramètre les paramètres
// logger position de chaque element et la position du scroll actuel
// trigger quand le croisement se fait
// faire passer dans le container
// faire que ca suive la position à l'écran
