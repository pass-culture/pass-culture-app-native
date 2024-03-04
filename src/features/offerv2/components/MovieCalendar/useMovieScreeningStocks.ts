import { OfferStockResponse } from 'api/gen'

export const useMovieScreeningStocks = (stocks: OfferStockResponse[]) => {
  const movieScreeningStocks = stocks.reduce<{
    [key: string]: OfferStockResponse[]
  }>((movieScreening, movieStock) => {
    const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
    if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
      const movieScreeningDay = beginningDatetime.split('T')[0]
      if (movieScreening[movieScreeningDay]) {
        movieScreening[movieScreeningDay].push(movieStock)
      } else {
        movieScreening[movieScreeningDay] = [movieStock]
      }
    }

    return movieScreening
  }, {})

  const movieScreeningDates: Date[] = Object.keys(movieScreeningStocks).map(
    (dateString) => new Date(dateString)
  )

  return { movieScreeningStocks, movieScreeningDates }
}
