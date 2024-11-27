import { SubcategoryIdEnum } from 'api/gen'
import { formatDates, formatReleaseDate } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'

export const useOfferDates = (offer: Offer): string | undefined => {
  const { offer: offerDetails } = offer
  const { subcategoryId, dates, releaseDate } = offerDetails

  const isOfferAMovieScreeningWithAReleaseDate =
    subcategoryId === SubcategoryIdEnum.SEANCE_CINE &&
    releaseDate &&
    typeof releaseDate === 'number' // we do this because for now, some offers' releaseDate attribute have the wrong type

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)

  return isOfferAMovieScreeningWithAReleaseDate
    ? formatReleaseDate(releaseDate * 1000)
    : formatDates(timestampsInMillis)
}
