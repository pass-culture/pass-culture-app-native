import { format } from 'date-fns'
import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { MovieCalendarResponse, OfferResponseV2 } from 'api/gen'
import { ExpandingFlatList } from 'features/offer/components/ExpandingFlatlist/ExpandingFlatList'
import {
  useDisableCalendarDates,
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { CineBlockSkeleton } from 'features/offer/components/OfferCine/CineBlockSkeleton'
import { VenueScreening } from 'features/offer/components/OfferCine/VenueScreening'
import { INITIAL_LIST_SIZE, expandList, hasReachedEnd } from 'features/offer/helpers/expandableList'
import {
  getDaysWithNoScreenings,
  useGetVenuesByDay,
} from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'
import { useMovieCalendarQuery } from 'features/offer/queries/useMovieCalendarQuery'
import { useOffersStocksFromOfferQuery } from 'features/offer/queries/useOffersStocksFromOfferQuery'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Typo } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

const DEFAULT_RADIUS_M = 50 * 1000

const vm = (selectedDate: Date) => (data: MovieCalendarResponse) => {
  const datesString = Object.keys(data.calendar)
  const dates = datesString.map((date) => new Date(date))
  const disabledDates = datesString.filter((date) => data.calendar[date]?.length === 0)

  return {
    dates,
    disabledDates,
    selectedDateOffers: data.calendar[format(selectedDate, 'yyyy-MM-dd')],
    hasNoStocks: disabledDates.length === dates.length,
  }
}

export const NewOfferCineContent: FC<Props> = ({ offer, onSeeVenuePress }) => {
  const { designSystem } = useTheme()
  const { latitude, longitude } = useUserLocation()

  const { data: offers } = useOffersStocksFromOfferQuery(offer)
  const { selectedDate, dates } = useMovieCalendar()
  const { movieOffers, hasStocksOnlyAfter15Days } = useGetVenuesByDay(selectedDate, offers.offers)

  const { data: query, isLoading: isQueryLoading } = useMovieCalendarQuery(
    {
      latitude,
      longitude,
      aroundRadius: DEFAULT_RADIUS_M,
      allocineId: offer.extraData?.allocineId ? String(offer.extraData?.allocineId) : undefined,
    },
    { select: vm(selectedDate) }
  )

  const [displayedLen, setDisplayedLen] = useState(INITIAL_LIST_SIZE)

  const disabledDates = getDaysWithNoScreenings(offers.offers, dates)

  useDisplayCalendar(!hasStocksOnlyAfter15Days)
  useDisableCalendarDates(disabledDates)

  console.log(query)

  useEffect(() => {
    setDisplayedLen(INITIAL_LIST_SIZE)
  }, [selectedDate])

  return (
    <View>
      <ExpandingFlatList
        data={query?.selectedDateOffers}
        isLoading={isQueryLoading}
        skeletonListLength={3}
        renderSkeleton={() => <CineBlockSkeleton />}
        renderItem={({ item }) => (
          <VenueScreening
            venueScreening={item}
            offer={offer}
            onSeeVenuePress={onSeeVenuePress}
            withDivider
          />
        )}
      />
      {hasReachedEnd(movieOffers, displayedLen) ? null : (
        <SeeMoreContainer>
          <Text>Aucune séance ne te correspond&nbsp;?</Text>
          <ButtonSecondary
            mediumWidth
            icon={PlainMore}
            wording="Afficher plus de cinémas"
            onPress={() => setDisplayedLen(expandList(movieOffers, displayedLen))}
            color={designSystem.color.text.default}
          />
        </SeeMoreContainer>
      )}
    </View>
  )
}

const SeeMoreContainer = styled.View(({ theme }) => ({
  alignItems: theme.isMobileViewport ? 'center' : undefined,
  marginTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.l,
}))

const Text = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
