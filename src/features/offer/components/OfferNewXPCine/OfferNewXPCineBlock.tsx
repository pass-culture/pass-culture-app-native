import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { CineBlock } from 'features/offer/components/OfferNewXPCine/CineBlock'
import { Subcategory } from 'libs/subcategories/types'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  distance?: string
  offer: OfferResponseV2
  subcategory: Subcategory
  onSeeVenuePress?: VoidFunction
}

export function OfferNewXPCineBlock({
  title,
  distance,
  onSeeVenuePress,
  offer,
  subcategory,
}: Readonly<Props>) {
  const theme = useTheme()
  const { stocks, isExternalBookingsDisabled } = offer
  const offerVenueId = offer.venue.id

  const { movieScreeningDates, selectedDate, setSelectedDate, selectedScreeningStock } =
    useMovieScreeningCalendar(stocks)

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const flatListRef = useRef<FlatList | null>(null)

  const eventCardData = useMemo(
    () => selectedDateScreenings(offerVenueId, onPressOfferCTA, movieScreeningUserData),
    [offerVenueId, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )

  useEffect(() => {
    if (flatListRef?.current) {
      setSelectedDate(movieScreeningDates[0])
      flatListRef.current?.scrollToOffset({ offset: 0 })
    }
  }, [flatListRef, movieScreeningDates, setSelectedDate])

  return (
    <Container testID="offer-new-xp-cine-block">
      <TitleContainer>
        <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
      </TitleContainer>

      <Spacer.Column numberOfSpaces={4} />

      <MovieCalendarContainer>
        <MovieCalendar
          dates={movieScreeningDates}
          selectedDate={selectedDate}
          onTabChange={setSelectedDate}
          flatListRef={flatListRef}
        />
      </MovieCalendarContainer>

      <View>
        <CineBlock
          offer={offer}
          distance={distance}
          onSeeVenuePress={onSeeVenuePress}
          CTAOfferModal={CTAOfferModal}
          eventCardData={eventCardData}
        />
        <Spacer.Column numberOfSpaces={theme.isDesktopViewport ? 6 : 4} />
        <Divider />
      </View>
    </Container>
  )
}

const Container = styled(View)({
  marginVertical: 0,
})

const MovieCalendarContainer = styled(View)(({ theme }) => ({
  marginRight: theme.isDesktopViewport ? -getSpacing(16) : 0, // cancels padding of the parent container
}))

const TitleContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
}))

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
}))
