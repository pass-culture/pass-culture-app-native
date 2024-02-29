import {
  buildDatePredicate,
  buildHomepageDatePredicate,
  buildOfferLast30DaysBookings,
  buildOfferPriceRangePredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildNumericFiltersHelpers/buildNumericFiltersHelpers'
import { SearchQueryParameters } from 'libs/algolia/types'

import { FiltersArray } from '../../types'

export const buildNumericFilters = ({
  date,
  beginningDatetime,
  endingDatetime,
  offerIsFree,
  priceRange,
  timeRange,
  minPrice,
  maxPrice,
  maxPossiblePrice,
  minBookingsThreshold,
}: Pick<
  SearchQueryParameters,
  | 'beginningDatetime'
  | 'endingDatetime'
  | 'date'
  | 'offerIsFree'
  | 'priceRange'
  | 'timeRange'
  | 'minPrice'
  | 'maxPrice'
  | 'maxPossiblePrice'
  | 'minBookingsThreshold'
>): null | {
  numericFilters: FiltersArray
} => {
  const priceRangePredicate = buildOfferPriceRangePredicate({
    offerIsFree,
    priceRange,
    minPrice,
    maxPrice,
    maxPossiblePrice,
  })
  const datePredicate = buildDatePredicate({ date, timeRange })
  const homepageDatePredicate = buildHomepageDatePredicate({ beginningDatetime, endingDatetime })
  const last30DaysBookingsPredicate = buildOfferLast30DaysBookings(minBookingsThreshold)
  const numericFilters: FiltersArray = []

  if (priceRangePredicate) numericFilters.push(priceRangePredicate)
  if (datePredicate) numericFilters.push(datePredicate)
  if (homepageDatePredicate) numericFilters.push(homepageDatePredicate)
  if (last30DaysBookingsPredicate) numericFilters.push(last30DaysBookingsPredicate)

  return numericFilters.length > 0 ? { numericFilters } : null
}
