import { SubcategoryIdEnumv2 } from 'api/gen'
import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { OffersModuleParameters } from 'features/home/types'
import { sortCategories } from 'features/search/helpers/reducer.helpers'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { buildOfferGenreTypesValues } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOfferGenreTypesValues'
import { SearchQueryParameters } from 'libs/algolia/types'
import { GenreTypeMapping, SubcategoryLabelMapping } from 'libs/subcategories/types'

export const adaptOffersPlaylistParameters = (
  parameters: OffersModuleParameters,
  subcategoryLabelMapping: SubcategoryLabelMapping,
  genreTypeMapping: GenreTypeMapping
): SearchQueryParameters => {
  const { priceMin, priceMax } = parameters

  const { beginningDatetime, endingDatetime } = computeBeginningAndEndingDatetimes({
    beginningDatetime: parameters.beginningDatetime,
    endingDatetime: parameters.endingDatetime,
    eventDuringNextXDays: parameters.eventDuringNextXDays,
    upcomingWeekendEvent: parameters.upcomingWeekendEvent,
    currentWeekEvent: parameters.currentWeekEvent,
  })

  // We receive category labels from contentful. We first have to map to facetFilters used for search
  const offerCategories = (parameters.categories ?? [])
    .map(getCategoriesFacetFilters)
    .sort(sortCategories)

  const offerSubcategories = (parameters.subcategories ?? [])
    .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
    .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined)

  const offerGenreTypes = buildOfferGenreTypesValues(
    {
      bookTypes: parameters.bookTypes,
      movieGenres: parameters.movieGenres,
      musicTypes: parameters.musicTypes,
      showTypes: parameters.showTypes,
    },
    genreTypeMapping
  )

  return {
    beginningDatetime,
    endingDatetime,
    hitsPerPage: parameters.hitsPerPage ?? null,
    offerCategories,
    offerSubcategories,
    offerIsDuo: parameters.isDuo ?? false,
    isDigital: parameters.isDigital ?? false,
    priceRange: _buildPriceRange({ priceMin, priceMax }),
    tags: parameters.tags ?? [],
    allocineIdList: parameters.allocineIdList ?? [],
    date: null,
    timeRange: null,
    query: '',
    minBookingsThreshold: parameters.minBookingsThreshold || 0,
    offerGenreTypes,
    offerGtlLabel: parameters.gtlLabel,
    offerGtlLevel: parameters.gtlLevel,
    offerNativeCategories: [],
    ...(parameters.likesMin ? { minLikes: parameters.likesMin } : undefined),
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}
