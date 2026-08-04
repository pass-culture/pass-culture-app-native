import React, { FC, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, type MovieScreenings, type Screening } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import {
  getEventCardIsEnabled,
  getEventCardLeftSubtitle,
  getEventCardRightSubtitle,
} from 'features/offer/helpers/screeningBlockInfo/screeningBlockInfo'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BookOfferModal } from 'shared/offer/components/BookOfferModal/BookOfferModal'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { useModal } from 'ui/components/modals/useModal'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'

type MovieOfferTileV2Props = {
  movieScreenings: MovieScreenings
  venueId: number
  isLast: boolean
}

const transformScreening = (
  screening: Screening,
  setSelectedScreening,
  offerId,
  venueId,
  currency,
  euroToPacificFrancRate,
  showModal
) =>
  ({
    onPress: () => {
      setSelectedScreening(screening)
      triggerConsultOfferLog({
        offerId: offerId,
        from: 'venue',
        venueId: venueId,
      })
      showModal()
    },
    isDisabled: !getEventCardIsEnabled(screening),
    title: formatHour(screening.beginningDatetime).replace(':', 'h'),
    subtitleLeft: getEventCardLeftSubtitle(screening),
    subtitleRight: getEventCardRightSubtitle(screening, currency, euroToPacificFrancRate),
  }) as EventCardProps

export const MovieOfferTileV2: FC<MovieOfferTileV2Props> = ({
  movieScreenings,
  venueId,
  isLast,
}) => {
  const { goToDate } = useMovieCalendar()
  const { offerId, nextScreening } = movieScreenings
  const nextScreeningDate = nextScreening ? new Date(nextScreening.beginningDatetime) : null

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const [selectedScreening, setSelectedScreening] = useState<Screening>()
  const modalSettings = useModal(false)

  return (
    <React.Fragment>
      <StyledView>
        {movieScreenings.dayScreenings ? (
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
          <NextScreeningButton
            date={nextScreeningDate}
            onPress={() => goToDate(nextScreeningDate)}
          />
        </View>
      ) : (
        <EventCardList
          data={movieScreenings.dayScreenings?.map((screening) =>
            transformScreening(
              screening,
              setSelectedScreening,
              offerId,
              venueId,
              currency,
              euroToPacificFrancRate,
              modalSettings.showModal
            )
          )}
        />
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

const getSubtitles = (movieScreenings: MovieScreenings): string[] => {
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
