import { SubcategoryIdEnum } from 'api/gen'
import { formatDates, formatReleaseDate, getTimeStampInMillis } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'

export const getOfferDates = (offer: Offer): string | undefined => {
  const { subcategoryId, dates, releaseDate } = offer.offer

  const isOfferAMovieScreeningWithAReleaseDate =
    subcategoryId === SubcategoryIdEnum.SEANCE_CINE && typeof releaseDate === 'number' // we do this because for now, some offers' releaseDate attribute have the wrong type

  return isOfferAMovieScreeningWithAReleaseDate
    ? formatReleaseDate(new Date(releaseDate * 1000))
    : formatDates(dates && getTimeStampInMillis(dates))
}
