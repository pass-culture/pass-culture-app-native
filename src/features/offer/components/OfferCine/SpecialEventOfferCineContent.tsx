import React, { FC, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { ExpandingFlatList } from 'features/offer/components/ExpandingFlatlist/ExpandingFlatList'
import {
  useDisableCalendarDates,
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { CineBlockSkeleton } from 'features/offer/components/OfferCine/CineBlockSkeleton'
import { SpecialEventCineBlock } from 'features/offer/components/OfferCine/SpecialEventCineBlock'
import {
  INITIAL_LIST_SIZE,
  expandList,
  getListToDisplay,
  hasReachedEnd,
} from 'features/offer/helpers/expandableList'
import {
  getDaysWithNoScreenings,
  useGetSpecialEventVenuesByDay,
} from 'features/offer/helpers/useGetVenueByDay/useGetSpecialEventVenuesByDay'
import { useOffersStocksFromOfferSpecialEventQuery } from 'features/offer/queries/useOffersStocksFromOfferSpecialEventQuery'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse
  onSeeVenuePress?: VoidFunction
}

export const SpecialEventOfferCineContent: FC<Props> = ({ offer, onSeeVenuePress }) => {
  const { data: offers, isLoading } = useOffersStocksFromOfferSpecialEventQuery(offer)
  const { selectedDate, dates } = useMovieCalendar()
  const { movieOffers, hasStocksOnlyAfter15Days } = useGetSpecialEventVenuesByDay(
    selectedDate,
    offers.offers
  )

  const selectedDateKey = selectedDate.toISOString()
  const [displayState, setDisplayState] = useState({
    selectedDateKey,
    displayedLen: INITIAL_LIST_SIZE,
  })
  const displayedLen =
    displayState.selectedDateKey === selectedDateKey ? displayState.displayedLen : INITIAL_LIST_SIZE

  const disabledDates = getDaysWithNoScreenings(offers.offers, dates)

  useDisplayCalendar(!hasStocksOnlyAfter15Days)
  useDisableCalendarDates(disabledDates)

  return (
    <View>
      <ExpandingFlatList
        data={getListToDisplay(movieOffers, displayedLen)}
        isLoading={isLoading}
        skeletonListLength={3}
        renderSkeleton={() => <CineBlockSkeleton />}
        keyExtractor={(item, index) => `${item.offer.id}-${index}`}
        renderItem={({ item }) => (
          <SpecialEventCineBlock
            offer={item.offer}
            onSeeVenuePress={onSeeVenuePress}
            nextDate={item.nextDate}
            withDivider
          />
        )}
      />
      {hasReachedEnd(movieOffers, displayedLen) ? null : (
        <SeeMoreContainer>
          <Text>Aucune séance ne te correspond&nbsp;?</Text>
          <Button
            icon={PlainMore}
            wording="Afficher plus de cinémas"
            onPress={() =>
              setDisplayState({
                selectedDateKey,
                displayedLen: expandList(movieOffers, displayedLen),
              })
            }
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
