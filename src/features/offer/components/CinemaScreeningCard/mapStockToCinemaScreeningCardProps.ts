import { StockResponse } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { getCinemaScreeningCardDisabledReason } from './getCinemaScreeningCardDisabledReason'
import { getCinemaScreeningFeaturesProps } from './getCinemaScreeningFeaturesProps'
import { CinemaScreeningCardProps } from './types'

type Props = {
  screening: StockResponse
  offerVenueId: number
  onSelectScreening: (bookingData: MovieScreeningBookingData) => void
  currency: Currency
  euroToPacificFrancRate: number
  onPressOfferCTA?: VoidFunction
  movieScreeningUserData?: MovieScreeningUserData
  isExternalBookingsDisabled?: boolean
}

export const mapStockToCinemaScreeningCardProps = ({
  screening,
  offerVenueId,
  onSelectScreening,
  currency,
  euroToPacificFrancRate,
  onPressOfferCTA,
  movieScreeningUserData,
  isExternalBookingsDisabled,
}: Props): CinemaScreeningCardProps | undefined => {
  if (!screening.beginningDatetime) {
    return undefined
  }

  const disabledReason = getCinemaScreeningCardDisabledReason({
    screening,
    offerVenueId,
    movieScreeningUserData,
    isExternalBookingsDisabled,
  })
  const beginningDate = new Date(screening.beginningDatetime)

  const onPress = () => {
    if (disabledReason) return

    onSelectScreening({
      date: beginningDate,
      hour: beginningDate.getHours(),
      stockId: screening.id,
    })
    onPressOfferCTA?.()
  }

  return {
    onPress,
    time: formatHour(screening.beginningDatetime).replace(':', 'h'),
    price: formatCurrencyFromCents(screening.price, currency, euroToPacificFrancRate),
    disabledReason,
    ...(screening.screeningFeatures
      ? getCinemaScreeningFeaturesProps(screening.screeningFeatures)
      : { languages: [] }),
  }
}
