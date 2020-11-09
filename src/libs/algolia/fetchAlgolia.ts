import { SearchResponse } from '@algolia/client-search'
import algoliasearch from 'algoliasearch'

import { computeTimeRangeFromHoursToSeconds, TIMESTAMP } from 'libs/algolia/datetime/time'
import { env } from 'libs/environment'

import { NoNullProperties, Range } from '../typesUtils/typeHelpers'

import { FACETS_ENUM, RADIUS_FILTERS, DATE_FILTER_OPTIONS } from './enums'
import { FiltersArray, FetchAlgoliaParameters } from './types'

export const fetchAlgolia = <T>({
  aroundRadius = RADIUS_FILTERS.DEFAULT_RADIUS_IN_KILOMETERS,
  beginningDatetime = null,
  date = null,
  endingDatetime = null,
  geolocation = null,
  hitsPerPage = null,
  keywords = '',
  offerCategories = [],
  offerIsDuo = false,
  offerIsFree = false,
  offerIsNew = false,
  offerTypes = {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
  page = 0,
  priceRange = null,
  sortBy = '',
  searchAround = false,
  timeRange = null,
  tags = [],
}: FetchAlgoliaParameters): Readonly<Promise<SearchResponse<T>>> => {
  const searchParameters = {
    page,
    ...buildFacetFilters({ offerCategories, offerTypes, offerIsDuo, tags }),
    ...buildNumericFilters({
      beginningDatetime,
      date,
      endingDatetime,
      offerIsFree,
      offerIsNew,
      priceRange,
      timeRange,
    }),
    ...buildGeolocationParameter({ aroundRadius, geolocation, searchAround }),
    ...buildHitsPerPage(hitsPerPage),
  }
  const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME + sortBy)

  return index.search<T>(keywords, searchParameters)
}

const buildHitsPerPage = (hitsPerPage: FetchAlgoliaParameters['hitsPerPage']) =>
  hitsPerPage ? { hitsPerPage } : null

const buildFacetFilters = ({
  offerCategories,
  offerTypes,
  offerIsDuo,
  tags,
}: Pick<FetchAlgoliaParameters, 'offerCategories' | 'offerTypes' | 'offerIsDuo' | 'tags'>): null | {
  facetFilters: FiltersArray
} => {
  if (offerCategories.length === 0 && offerTypes == null && offerIsDuo === false) {
    return null
  }

  const facetFilters: FiltersArray = []

  if (offerCategories.length > 0) {
    const categoriesPredicate = buildOfferCategoriesPredicate(offerCategories)
    facetFilters.push(categoriesPredicate)
  }

  const offerTypesPredicate = buildOfferTypesPredicate(offerTypes)
  if (offerTypesPredicate) {
    facetFilters.push(...offerTypesPredicate)
  }

  const offerIsDuoPredicate = buildOfferIsDuoPredicate(offerIsDuo)
  if (offerIsDuoPredicate) {
    facetFilters.push(offerIsDuoPredicate)
  }

  const tagsPredicate = buildTagsPredicate(tags)
  if (tagsPredicate) {
    facetFilters.push(tagsPredicate)
  }

  const atLeastOneFacetFilter = facetFilters.length > 0
  return atLeastOneFacetFilter ? { facetFilters } : null
}

const buildNumericFilters = ({
  date,
  beginningDatetime,
  endingDatetime,
  offerIsFree,
  offerIsNew,
  priceRange,
  timeRange,
}: Pick<
  FetchAlgoliaParameters,
  | 'beginningDatetime'
  | 'endingDatetime'
  | 'date'
  | 'offerIsFree'
  | 'offerIsNew'
  | 'priceRange'
  | 'timeRange'
>): null | {
  numericFilters: FiltersArray
} => {
  const priceRangePredicate = buildOfferPriceRangePredicate({ offerIsFree, priceRange })
  const datePredicate = buildDatePredicate({ date, timeRange })
  const newestOffersPredicate = buildNewestOffersPredicate(offerIsNew)
  const homepageDatePredicate = buildHomepageDatePredicate({ beginningDatetime, endingDatetime })
  const numericFilters: FiltersArray = []

  if (priceRangePredicate) {
    numericFilters.push(priceRangePredicate)
  }

  if (datePredicate) {
    numericFilters.push(datePredicate)
  }

  if (newestOffersPredicate) {
    numericFilters.push(newestOffersPredicate)
  }

  if (homepageDatePredicate) {
    numericFilters.push(homepageDatePredicate)
  }

  return numericFilters.length > 0 ? { numericFilters } : null
}

const buildOfferCategoriesPredicate = (
  offerCategories: FetchAlgoliaParameters['offerCategories']
): string[] => {
  return offerCategories.map((category: string) => `${FACETS_ENUM.OFFER_CATEGORY}:${category}`)
}

const buildOfferIsDuoPredicate = (
  offerIsDuo: FetchAlgoliaParameters['offerIsDuo']
): string[] | undefined => {
  if (offerIsDuo) {
    return [`${FACETS_ENUM.OFFER_IS_DUO}:${offerIsDuo}`]
  }
  return undefined
}

const buildOfferPriceRangePredicate = ({
  offerIsFree,
  priceRange,
}: Pick<FetchAlgoliaParameters, 'offerIsFree' | 'priceRange'>): FiltersArray[0] | undefined => {
  if (offerIsFree) return [`${FACETS_ENUM.OFFER_PRICE} = 0`]
  if (priceRange) {
    return [`${FACETS_ENUM.OFFER_PRICE}: ${priceRange.join(' TO ')}`]
  }
  return undefined
}

const buildTimeOnlyPredicate = (timeRange: Range<number>): FiltersArray[0] => {
  const timeRangeInSeconds = computeTimeRangeFromHoursToSeconds(timeRange)
  return [`${FACETS_ENUM.OFFER_TIME}: ${timeRangeInSeconds.join(' TO ')}`]
}

const buildDatePredicate = ({
  date,
  timeRange,
}: Pick<FetchAlgoliaParameters, 'date' | 'timeRange'>): FiltersArray[0] | undefined => {
  if (date && timeRange) {
    return buildDateAndTimePredicate({ date, timeRange })
  } else if (date) {
    return buildDateOnlyPredicate(date)
  } else if (timeRange) {
    return buildTimeOnlyPredicate(timeRange)
  }
  return undefined
}

const buildHomepageDatePredicate = ({
  beginningDatetime,
  endingDatetime,
}: Pick<FetchAlgoliaParameters, 'beginningDatetime' | 'endingDatetime'>):
  | undefined
  | FiltersArray[0] => {
  if (!(beginningDatetime || endingDatetime)) {
    return undefined
  }

  if (beginningDatetime && !endingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(beginningDatetime)
    return [`${FACETS_ENUM.OFFER_DATE} >= ${beginningTimestamp}`]
  }

  if (!beginningDatetime && endingDatetime) {
    const endingTimestamp = TIMESTAMP.getFromDate(endingDatetime)
    return [`${FACETS_ENUM.OFFER_DATE} <= ${endingTimestamp}`]
  }

  if (beginningDatetime && endingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(beginningDatetime)
    const endingTimestamp = TIMESTAMP.getFromDate(endingDatetime)
    return [getDatePredicate(beginningTimestamp, endingTimestamp)]
  }

  return undefined
}

const getDatePredicate = (lowerDate: number, higherDate: number): string =>
  `${FACETS_ENUM.OFFER_DATE}: ${lowerDate} TO ${higherDate}`

const buildDateAndTimePredicate = ({
  date,
  timeRange,
}: NoNullProperties<Pick<FetchAlgoliaParameters, 'date' | 'timeRange'>>): FiltersArray[0] => {
  let dateFilter, rangeTimestamps
  switch (date.option) {
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      dateFilter = TIMESTAMP.WEEK.getAllFromTimeRangeAndDate(
        date.selectedDate,
        timeRange
      ).map((timestampsRangeForADay: Range<number>) =>
        getDatePredicate(timestampsRangeForADay[0], timestampsRangeForADay[1])
      )
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      dateFilter = TIMESTAMP.WEEK_END.getAllFromTimeRangeAndDate(
        date.selectedDate,
        timeRange
      ).map((timestampsRangeForADay: Range<number>) =>
        getDatePredicate(timestampsRangeForADay[0], timestampsRangeForADay[1])
      )
      break
    default:
      rangeTimestamps = TIMESTAMP.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)
      dateFilter = [getDatePredicate(rangeTimestamps[0], rangeTimestamps[1])]
  }
  return dateFilter
}

const buildDateOnlyPredicate = (
  date: Exclude<FetchAlgoliaParameters['date'], null>
): FiltersArray[0] => {
  let beginningDate, endingDate
  switch (date.option) {
    case DATE_FILTER_OPTIONS.TODAY:
      beginningDate = TIMESTAMP.getFromDate(date.selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      beginningDate = TIMESTAMP.getFromDate(date.selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      beginningDate = TIMESTAMP.WEEK_END.getFirstFromDate(date.selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.USER_PICK:
      beginningDate = TIMESTAMP.getFirstOfDate(date.selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
  }
  return [getDatePredicate(beginningDate, endingDate)]
}

const buildNewestOffersPredicate = (
  offerIsNew: FetchAlgoliaParameters['offerIsNew']
): FiltersArray[0] | undefined => {
  if (offerIsNew) {
    const now = new Date()
    const fifteenDaysBeforeNow = new Date().setDate(now.getDate() - 15)
    const beginningDate = TIMESTAMP.getFromDate(new Date(fifteenDaysBeforeNow))
    const endingDate = TIMESTAMP.getFromDate(now)

    return [`${FACETS_ENUM.OFFER_STOCKS_DATE_CREATED}: ${beginningDate} TO ${endingDate}`]
  }
  return undefined
}

const buildOfferTypesPredicate = (
  offerTypes: FetchAlgoliaParameters['offerTypes']
): FiltersArray | undefined => {
  const { isDigital, isEvent, isThing } = offerTypes
  if (isDigital) {
    if (!isEvent && !isThing) {
      return [[`${FACETS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`]]
    }
    if (!isEvent && isThing) {
      return [[`${FACETS_ENUM.OFFER_IS_THING}:${isThing}`]]
    }
    if (isEvent && !isThing) {
      return [
        [
          `${FACETS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`,
          `${FACETS_ENUM.OFFER_IS_EVENT}:${isEvent}`,
        ],
      ]
    }
  } else {
    if (!isEvent && isThing) {
      return [
        [`${FACETS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`],
        [`${FACETS_ENUM.OFFER_IS_THING}:${isThing}`],
      ]
    }
    if (isEvent && !isThing) {
      return [[`${FACETS_ENUM.OFFER_IS_EVENT}:${isEvent}`]]
    }
    if (isEvent && isThing) {
      return [[`${FACETS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`]]
    }
  }
  return undefined
}

const buildGeolocationParameter = ({
  aroundRadius,
  geolocation,
  searchAround,
}: Pick<FetchAlgoliaParameters, 'aroundRadius' | 'geolocation' | 'searchAround'>):
  | {
      aroundLatLng: string
      aroundRadius: 'all' | number
    }
  | undefined => {
  if (geolocation) {
    const { longitude, latitude } = geolocation
    if (latitude && longitude) {
      const aroundRadiusInMeters = computeRadiusInMeters(aroundRadius, searchAround)
      const radiusIsPositive = aroundRadiusInMeters > 0

      return {
        aroundLatLng: `${latitude}, ${longitude}`,
        aroundRadius:
          searchAround && radiusIsPositive ? aroundRadiusInMeters : RADIUS_FILTERS.UNLIMITED_RADIUS,
      }
    }
  }
  return undefined
}

const computeRadiusInMeters = (aroundRadius: number | null, searchAround: boolean): number => {
  if (searchAround && aroundRadius === 0) {
    return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  }
  if (aroundRadius === null) {
    return -1
  }
  return aroundRadius * 1000
}

const buildTagsPredicate = (tags: FetchAlgoliaParameters['tags']): FiltersArray[0] | undefined => {
  if (tags.length > 0) {
    return tags.map((tag: string) => `${FACETS_ENUM.OFFER_TAGS}:${tag}`)
  }
  return undefined
}
