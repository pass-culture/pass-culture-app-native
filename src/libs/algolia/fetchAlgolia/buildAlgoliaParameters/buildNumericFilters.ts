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
    priceRange,
    timeRange,
    minPrice,
    maxPrice,
    minBookingsThreshold,
    minLikes,
    isWithClub,
  }: Pick<
    SearchQueryParameters,
    | 'beginningDatetime'
    | 'endingDatetime'
    | 'date'
    | 'priceRange'
    | 'timeRange'
    | 'minPrice'
    | 'maxPrice'
    | 'minBookingsThreshold'
    | 'isHeadline'
    | 'minLikes'
    | 'isWithClub'
  >,
  isUsedFromSearch?: boolean
): null | {
  numericFilters: FiltersArray
} => {
  const priceRangePredicate = buildOfferPriceRangePredicate({
    priceRange,
    minPrice,
    maxPrice,
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
  if (isWithClub) numericFilters.push([`${NUMERIC_FILTERS_ENUM.OFFER_CHRONICLES_COUNT} > 0`])

  return numericFilters.length > 0 ? { numericFilters } : null
}
