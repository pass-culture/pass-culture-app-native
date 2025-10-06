import { NUMERIC_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import {
  buildDatePredicate,
  buildHomepageDatePredicate,
  buildOfferLast30DaysBookings,
  buildOfferPriceRangePredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildNumericFiltersHelpers/buildNumericFiltersHelpers'
import { FiltersArray, SearchQueryParameters } from 'libs/algolia/types'

export const buildNumericFilters = (
  {
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
    minLikes,
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
    | 'isHeadline'
    | 'minLikes'
  >,
  isUsedFromSearch?: boolean
): null | {
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
  const homepageDatePredicate = buildHomepageDatePredicate(
    {
      beginningDatetime,
      endingDatetime,
    },
    isUsedFromSearch
  )
  const last30DaysBookingsPredicate = buildOfferLast30DaysBookings(minBookingsThreshold)
  const numericFilters: FiltersArray = []

  if (priceRangePredicate) numericFilters.push(priceRangePredicate)
  if (datePredicate) numericFilters.push(datePredicate)
  if (homepageDatePredicate) numericFilters.push(homepageDatePredicate)
  if (last30DaysBookingsPredicate) numericFilters.push(last30DaysBookingsPredicate)
  if (minLikes) numericFilters.push([`${NUMERIC_FILTERS_ENUM.OFFER_LIKES} > ${minLikes}`])

  return numericFilters.length > 0 ? { numericFilters } : null
}
