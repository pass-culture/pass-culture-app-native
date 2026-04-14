import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { ExpandingFlatList } from 'features/offer/components/ExpandingFlatlist/ExpandingFlatList'
import {
  useDisableCalendarDates,
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { CineBlock } from 'features/offer/components/OfferCine/CineBlock'
import { CineBlockSkeleton } from 'features/offer/components/OfferCine/CineBlockSkeleton'
import {
  getDaysWithNoScreenings,
  useGetVenuesByDay,
} from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { useOffersStocksFromOfferQuery } from 'features/offer/queries/useOffersStocksFromOfferQuery'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse
  onSeeVenuePress?: VoidFunction
}

const INITIAL_LIST_SIZE = 6
const LIST_INCREMENT = 3

export const OfferCineContent: FC<Props> = ({ offer, onSeeVenuePress }) => {
  const { data: offers, isLoading } = useOffersStocksFromOfferQuery(offer)
  const { selectedDate, dates } = useMovieCalendar()
  const { movieOffers, hasStocksOnlyAfter15Days } = useGetVenuesByDay(selectedDate, offers.offers)
  const [listSize, setListSize] = useState(INITIAL_LIST_SIZE)
  const expandList = () => setListSize(Math.min(movieOffers.length, listSize + LIST_INCREMENT))

  const disabledDates = getDaysWithNoScreenings(offers.offers, dates)

  useDisplayCalendar(!hasStocksOnlyAfter15Days)
  useDisableCalendarDates(disabledDates)

  useEffect(() => setListSize(INITIAL_LIST_SIZE), [selectedDate])

  return (
    <View>
      <ExpandingFlatList
        data={movieOffers.slice(0, listSize)}
        isLoading={isLoading}
        skeletonListLength={3}
        renderSkeleton={() => <CineBlockSkeleton />}
        renderItem={({ item }) => (
          <CineBlock
            offer={item.offer}
            onSeeVenuePress={onSeeVenuePress}
            nextDate={item.nextDate}
          />
        )}
      />
      {movieOffers.length <= listSize ? null : (
        <SeeMoreContainer>
          <Text>Aucune séance ne te correspond&nbsp;?</Text>
          <Button
            icon={PlainMore}
            wording="Afficher plus de cinémas"
            onPress={expandList}
            variant="secondary"
            color="neutral"
            fullWidth
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
  paddingHorizontal: theme.isMobileViewport ? theme.designSystem.size.spacing.xl : undefined,
  alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
}))

const Text = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
