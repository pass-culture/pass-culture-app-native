import { isWithinInterval, subDays } from 'date-fns'
import { SearchResponse } from 'instantsearch.js'

import { Offer } from 'shared/offer/types'

export const getMoviesOfTheWeek = (movies: SearchResponse<Offer>): SearchResponse<Offer> => {
  const today = new Date()
  const sevenDaysAgo = subDays(today, 7)
  const filteredHits = movies.hits.filter(
    (hit) =>
      hit.offer.releaseDate &&
      isWithinInterval(new Date(hit.offer.releaseDate), {
        start: sevenDaysAgo,
        end: today,
      })
  )
  return { ...movies, hits: filteredHits }
}
