type MovieScreeningStock = {
  beginningDatetime?: string | null
  isExpired: boolean
  isForbiddenToUnderage: boolean
}

export const getDateString = (date: string) => new Date(date).toDateString()

export const getMovieScreenings = <Stock extends MovieScreeningStock>(stocks: Stock[]) =>
  stocks.reduce<Record<string, Stock[]>>((movieScreenings, stock) => {
    const { beginningDatetime, isExpired, isForbiddenToUnderage } = stock

    if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
      const movieScreeningDay = getDateString(beginningDatetime)
      const stocksForDay = movieScreenings[movieScreeningDay]

      if (stocksForDay) {
        stocksForDay.push(stock)
      } else {
        movieScreenings[movieScreeningDay] = [stock]
      }
    }

    return movieScreenings
  }, {})
