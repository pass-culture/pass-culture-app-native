import React, { FC } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
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
import { useListExpander } from 'features/offer/helpers/useListExpander/useListExpander'
import { useOffersStocksFromOfferQuery } from 'features/offer/queries/useOffersStocksFromOfferQuery'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
  distance?: string | null
}

export const OfferCineContent: FC<Props> = ({ offer, onSeeVenuePress, distance }) => {
  const theme = useTheme()

  const { data: offers, isLoading } = useOffersStocksFromOfferQuery(offer)
  const { selectedDate, dates } = useMovieCalendar()
  const { movieOffers, hasStocksOnlyAfter15Days } = useGetVenuesByDay(selectedDate, offers.offers)

  const { items, hasReachedEnd, showMore } = useListExpander(movieOffers, {
    initialCount: 6,
    nextCount: 3,
  })

  const disabledDates = getDaysWithNoScreenings(offers.offers, dates)

  useDisplayCalendar(!hasStocksOnlyAfter15Days)
  useDisableCalendarDates(disabledDates)

  return (
    <View>
      <ExpandingFlatList
        data={items}
        isLoading={isLoading}
        skeletonListLength={3}
        renderSkeleton={() => <CineBlockSkeleton />}
        renderItem={({ item }) => (
          <CineBlock
            offer={item.offer}
            onSeeVenuePress={onSeeVenuePress}
            nextDate={item.nextDate}
            withDivider
            distance={distance}
          />
        )}
      />
      {hasReachedEnd ? null : (
        <SeeMoreContainer>
          <Text>Aucune séance ne te correspond&nbsp;?</Text>
          <ButtonSecondary
            mediumWidth
            icon={PlainMore}
            wording="Afficher plus de cinémas"
            onPress={showMore}
            color={theme.designSystem.color.text.default}
          />
        </SeeMoreContainer>
      )}
    </View>
  )
}

const SeeMoreContainer = styled.View(({ theme }) => ({
  alignItems: theme.isMobileViewport ? 'center' : undefined,
  marginTop: getSpacing(6),
  gap: getSpacing(4),
}))

const Text = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
