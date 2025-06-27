import { SubcategoryIdEnum } from 'api/gen'
import {
  formatDates,
  formatPlaylistDates,
  formatReleaseDate,
  getTimeStampInMillis,
} from 'libs/parsers/formatDates'

export const getOfferDates = ({
  subcategoryId,
  dates,
  releaseDate,
  isPlaylist,
}: {
  subcategoryId: SubcategoryIdEnum
  dates?: number[]
  releaseDate?: string | number
  isPlaylist?: boolean
}): string | undefined => {
  const isOfferAMovieScreeningWithAReleaseDate =
    subcategoryId === SubcategoryIdEnum.SEANCE_CINE && typeof releaseDate === 'number' // we do this because for now, some offers' releaseDate attribute have the wrong type

  const handleFormatDates = (timestamps?: number[]) =>
    isPlaylist ? formatPlaylistDates(timestamps) : formatDates(timestamps)

  return isOfferAMovieScreeningWithAReleaseDate
    ? formatReleaseDate({ releaseDate: new Date(releaseDate * 1000), isPlaylist })
    : handleFormatDates(dates && getTimeStampInMillis(dates))
}
