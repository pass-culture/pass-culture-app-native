import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { OfferEventCardList } from 'features/offer/components/OfferEventCardList/OfferEventCardList'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { Spacer } from 'ui/theme'

export type CineBlockProps = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
  nextDate?: Date
}
export const CineBlock: FunctionComponent<CineBlockProps> = ({
  offer,
  onSeeVenuePress,
  nextDate,
}) => {
  const { selectedDate, goToDate } = useMovieCalendar()

  return (
    <CineBlockContainer>
      <Spacer.Column numberOfSpaces={6} />
      <VenueBlock offer={offer} onSeeVenuePress={onSeeVenuePress} />
      <Spacer.Column numberOfSpaces={4} />
      {nextDate ? (
        <NextScreeningButton date={nextDate} onPress={() => goToDate(nextDate)} />
      ) : (
        <OfferEventCardList offer={offer} selectedDate={selectedDate} />
      )}
    </CineBlockContainer>
  )
}

const CineBlockContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
