import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums'
import {
  buildEanPredicate,
  buildObjectIdsPredicate,
  buildOfferCategoriesPredicate,
  buildOfferGenreTypesPredicate,
  buildOfferGtl,
  buildOfferIsDuoPredicate,
  buildOfferNativeCategoriesPredicate,
  buildOfferSubcategoriesPredicate,
  buildOfferTypesPredicate,
  buildTagsPredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildFacetFiltersHelpers/buildFacetFiltersHelpers'
import { FiltersArray, SearchQueryParameters } from 'libs/algolia/types'

const underageFilter = [[`${FACETS_FILTERS_ENUM.OFFER_ID_FORBIDDEN_TO_UNDERAGE}:false`]]
const defaultFilter = [[`${FACETS_FILTERS_ENUM.OFFER_IS_EDUCATIONAL}:false`]]

export const buildFacetFilters = ({
  venue,
  eanList,
  isUserUnderage,
  objectIds,
  enableAppLocation,
  offerCategories,
  offerGenreTypes,
  offerGtlLabel,
  offerGtlLevel,
  offerIsDuo,
  offerNativeCategories,
  offerSubcategories,
  offerTypes,
  tags,
  isFullyDigitalOffersCategory,
}: Pick<
  SearchQueryParameters,
  | 'venue'
  | 'offerCategories'
  | 'offerGenreTypes'
  | 'offerGtlLabel'
  | 'offerGtlLevel'
  | 'offerIsDuo'
  | 'offerNativeCategories'
  | 'offerSubcategories'
  | 'offerTypes'
  | 'tags'
  | 'isFullyDigitalOffersCategory'
> & {
  isUserUnderage: boolean
  objectIds?: string[]
  eanList?: string[]
  enableAppLocation?: boolean
}): null | {
  facetFilters: FiltersArray
} => {
  if (offerCategories.length === 0 && offerTypes == null && offerIsDuo === false) return null

  const facetFilters = [...defaultFilter]

  if (isUserUnderage) facetFilters.push(...underageFilter)

  if (offerCategories.length > 0) {
    const categoriesPredicate = buildOfferCategoriesPredicate(offerCategories)
    facetFilters.push(categoriesPredicate)
  }

  if (offerGtlLabel && offerGtlLevel) {
    facetFilters.push(buildOfferGtl(offerGtlLevel, offerGtlLabel))
  }

  if (offerSubcategories.length > 0) {
    const subcategoriesPredicate = buildOfferSubcategoriesPredicate(offerSubcategories)
    facetFilters.push(subcategoriesPredicate)
  }

  if (offerNativeCategories?.length) {
    const nativeCategoriesPredicate = buildOfferNativeCategoriesPredicate(offerNativeCategories)
    facetFilters.push(nativeCategoriesPredicate)
  }

  if (offerGenreTypes?.length) {
    const offerGenreTypesPredicate = buildOfferGenreTypesPredicate(offerGenreTypes)
    facetFilters.push(offerGenreTypesPredicate)
  }

  if (objectIds && objectIds.length > 0) {
    const objectIdsPredicate = buildObjectIdsPredicate(objectIds)
    facetFilters.push(objectIdsPredicate)
  }

  if (eanList && eanList?.length > 0) {
    const objectIdsPredicate = buildEanPredicate(eanList)
    facetFilters.push(objectIdsPredicate)
  }

  const offerTypesPredicate = buildOfferTypesPredicate(offerTypes)
  if (offerTypesPredicate) facetFilters.push(...offerTypesPredicate)

  const offerIsDuoPredicate = buildOfferIsDuoPredicate(offerIsDuo)
  if (offerIsDuoPredicate) facetFilters.push(offerIsDuoPredicate)

  const tagsPredicate = buildTagsPredicate(tags)
  if (tagsPredicate) facetFilters.push(tagsPredicate)

  if (venue && typeof venue.venueId === 'number')
    facetFilters.push([`${FACETS_FILTERS_ENUM.VENUE_ID}:${venue.venueId}`])

  return { facetFilters }
}
