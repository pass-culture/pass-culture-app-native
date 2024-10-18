import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { FlatList, Animated, Easing, View } from 'react-native'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import {
  getNextMoviesByDate,
  MovieOffer,
} from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { useNextDays } from 'features/offer/helpers/useNextDays/useNextDays'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useLayout } from 'ui/hooks/useLayout'
import { LENGTH_M, RATIO_HOME_IMAGE, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'

type Props = {
  venueOffers: VenueOffers
}

const keyExtractor = (item: Offer) => item.objectID

const useMoviesScreeningsList = (offerIds: number[]) => {
  const { selectedDate, setSelectedDate, dates } = useNextDays(15)
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const moviesOffers: MovieOffer[] = useMemo(() => {
    const filteredOffersWithStocks = filterOffersStocksByDate(
      offersWithStocks?.offers || [],
      selectedDate
    )
    const nextScreeningOffers = getNextMoviesByDate(offersWithStocks?.offers || [], selectedDate)

    return [...filteredOffersWithStocks, ...nextScreeningOffers]
  }, [offersWithStocks?.offers, selectedDate]).filter(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  return {
    dates,
    selectedDate,
    setSelectedDate,
    moviesOffers,
  }
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)

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
  const nonScreeningOffers = venueOffers.hits.filter(
    (offer) => offer.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
  )

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

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
    return (
      <OfferTile
        analyticsFrom="venue"
        offerLocation={item._geoloc}
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={mapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatDates(timestampsInMillis)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices, currency, euroToXPFRate)}
        venueId={item.venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
        variant={isNewOfferTileDisplayed ? 'new' : 'default'}
      />
    )
  }

  return (
    <React.Fragment>
      <Anchor name="venue-calendar">
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
      </Anchor>
      <Spacer.Column numberOfSpaces={4} />
      <Container>
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
      </Container>
      {nonScreeningOffers.length > 0 ? (
        <SectionWithDivider visible margin={false} gap={6}>
          <PassPlaylist
            testID="offersModuleList"
            title="Les autres offres"
            TitleComponent={PlaylistTitleText}
            data={nonScreeningOffers}
            itemHeight={LENGTH_M}
            itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </SectionWithDivider>
      ) : null}
    </React.Fragment>
  )
}

const Container = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const PlaylistTitleText = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))``
