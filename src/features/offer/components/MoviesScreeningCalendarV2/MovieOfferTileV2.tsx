import React, { FC, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, type MovieScreeningsV2, type ScreeningV2 } from 'api/gen'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import { getCinemaScreeningCardProps } from 'features/offer/components/CinemaScreeningCard/getCinemaScreeningCardProps'
import { useMovieCalendarV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieCalendarContextV2'
import { NextScreeningButtonV2 } from 'features/offer/components/MoviesScreeningCalendarV2/NextScreeningButtonV2'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatDateWithTimeZoneOffset } from 'libs/parsers/formatDates'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BookOfferModal } from 'shared/offer/components/BookOfferModal/BookOfferModal'
import { useModal } from 'ui/components/modals/useModal'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'

type MovieOfferTileV2Props = {
  movieScreenings: MovieScreeningsV2
  venueId: number
  isLast: boolean
}

export const MovieOfferTileV2: FC<MovieOfferTileV2Props> = ({
  movieScreenings,
  venueId,
  isLast,
}) => {
  const { goToDate } = useMovieCalendarV2()
  const { offerId, nextScreening } = movieScreenings
  const nextScreeningDate = nextScreening
    ? formatDateWithTimeZoneOffset(nextScreening.beginningDatetime, 'yyyy-MM-dd')
    : null

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const [selectedScreening, setSelectedScreening] = useState<ScreeningV2>()
  const modalSettings = useModal(false)
  const screeningCards = movieScreenings.dayScreenings.map((screening) =>
    getCinemaScreeningCardProps(
      screening,
      () => {
        setSelectedScreening(screening)
        triggerConsultOfferLog({ offerId, from: 'venue', venueId })
        modalSettings.showModal()
      },
      currency,
      euroToPacificFrancRate
    )
  )

  return (
    <React.Fragment>
      <StyledView>
        {movieScreenings.dayScreenings?.length ? (
          <HorizontalOfferTile
            offer={{
              offer: {
                name: movieScreenings.movieName,
                subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
                thumbUrl: movieScreenings.thumbUrl ?? undefined,
              },
              objectID: movieScreenings.offerId.toString(),
              venue: { id: venueId },
              _geoloc: {}, // _geoloc is not needed here as we wont display any distance
            }}
            analyticsParams={{ from: 'venue' }}
            shouldDisplayPrice={false}
            subtitles={getSubtitles(movieScreenings)}
            withRightArrow
          />
        ) : null}
      </StyledView>
      {nextScreeningDate && !movieScreenings.dayScreenings?.length ? (
        <View>
          <NextScreeningButtonV2
            date={nextScreeningDate}
            onPress={() => goToDate(nextScreeningDate)}
          />
        </View>
      ) : (
        <CinemaScreeningCardList screenings={screeningCards} />
      )}
      <Container>{isLast ? null : <Divider />}</Container>
      {selectedScreening ? (
        <BookOfferModal
          screening={selectedScreening}
          offerId={offerId}
          modalSettings={modalSettings}
          from={StepperOrigin.OFFER}></BookOfferModal>
      ) : null}
    </React.Fragment>
  )
}

const getSubtitles = (movieScreenings: MovieScreeningsV2): string[] => {
  const genre = movieScreenings.genres.join(' / ')
  const duration = formatDuration(movieScreenings.duration).label
  return [genre, duration]
}

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const StyledView = styled(View)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const Container = styled(View)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
