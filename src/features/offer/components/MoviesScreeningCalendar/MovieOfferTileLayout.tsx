import React, { FC, ReactNode } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { isDateNotWithinNextNbDays } from 'features/offer/helpers/isDateNotWithinNextNbDays'
import { VenueOffers } from 'features/venue/types'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'

type MovieOfferTileLayoutProps = {
  offerScreening?: VenueOffers['hits'][number]
  subtitles: string[]
  nextScreeningDate?: Date
  onPressOfferCTA: VoidFunction
  goToDate: (date: Date) => void
  screeningList: ReactNode
  CTAOfferModal: ReactNode
  isLast: boolean
}

export const MovieOfferTileLayout: FC<MovieOfferTileLayoutProps> = ({
  offerScreening,
  subtitles,
  nextScreeningDate,
  onPressOfferCTA,
  goToDate,
  screeningList,
  CTAOfferModal,
  isLast,
}) => (
  <React.Fragment>
    <OfferContainer>
      {offerScreening ? (
        <HorizontalOfferTile
          offer={offerScreening}
          analyticsParams={{ from: 'venue' }}
          shouldDisplayPrice={false}
          subtitles={subtitles}
          withRightArrow
        />
      ) : null}
    </OfferContainer>
    {nextScreeningDate ? (
      <View>
        <NextScreeningButton
          date={nextScreeningDate}
          onPress={
            isDateNotWithinNextNbDays(new Date(), nextScreeningDate, 15)
              ? () => onPressOfferCTA()
              : () => goToDate(nextScreeningDate)
          }
        />
      </View>
    ) : (
      screeningList
    )}
    <DividerContainer>{isLast ? null : <Divider />}</DividerContainer>
    {CTAOfferModal}
  </React.Fragment>
)

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const OfferContainer = styled(View)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const DividerContainer = styled(View)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
