import { DisabilitiesProperties } from 'features/accessibility/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import {
  buildAccessibiltyFiltersPredicate,
  buildAllocineIdPredicate,
  buildArtistNamePredicate,
  buildEanPredicate,
  buildHeadlinePredicate,
  buildObjectIdsPredicate,
  buildOfferCategoriesPredicate,
  buildOfferGenreTypesPredicate,
  buildOfferGtl,
  buildOfferGtlsPredicate,
  buildOfferIsDuoPredicate,
  buildOfferNativeCategoriesPredicate,
  buildOfferSubcategoriesPredicate,
  buildTagsPredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildFacetFiltersHelpers/buildFacetFiltersHelpers'
import { parseAndCleanStringsToNumbers } from 'libs/algolia/fetchAlgolia/utils'
import { FiltersArray, SearchQueryParameters } from 'libs/algolia/types'

const underageFilter = [[`${FACETS_FILTERS_ENUM.OFFER_ID_FORBIDDEN_TO_UNDERAGE}:false`]]
const defaultFilter = [[`${FACETS_FILTERS_ENUM.OFFER_IS_EDUCATIONAL}:false`]]

export const buildFacetFilters = ({
  venue,
  eanList,
  artistName,
  allocineId,
  allocineIdList,
  isUserUnderage,
  objectIds,
  isHeadline,
  offerCategories,
  offerGenreTypes,
  offerGtlLabel,
  offerGtlLevel,
  offerIsDuo,
  offerNativeCategories,
  offerSubcategories,
  isDigital,
  tags,
  gtls,
  disabilitiesProperties,
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
  | 'isDigital'
  | 'tags'
  | 'gtls'
  | 'isHeadline'
  | 'allocineIdList'
  | 'allocineId'
  | 'eanList'
  | 'artistName'
  | 'objectIds'
> & {
  isUserUnderage: boolean
  disabilitiesProperties: DisabilitiesProperties
}): null | {
  facetFilters: FiltersArray
} => {
  const facetFilters = [...defaultFilter]
  const hasGtls = gtls && gtls.length > 0
  if (isUserUnderage) facetFilters.push(...underageFilter)

  if (offerCategories.length > 0) {
    const categoriesPredicate = buildOfferCategoriesPredicate(offerCategories)
    facetFilters.push(categoriesPredicate)
  }

  if (offerGtlLabel && offerGtlLevel) {
    facetFilters.push(buildOfferGtl(offerGtlLevel, offerGtlLabel))
    if (offerGtlLabel === 'Sciences humaines & sociales') {
      facetFilters.push(['offer.gtlCodeLevel3:-09110800'])
    }
  }

  if (offerSubcategories.length > 0) {
    const subcategoriesPredicate = buildOfferSubcategoriesPredicate(offerSubcategories)
    facetFilters.push(subcategoriesPredicate)
  }

  if (offerNativeCategories?.length) {
    const nativeCategoriesPredicate = buildOfferNativeCategoriesPredicate(offerNativeCategories)
    facetFilters.push(nativeCategoriesPredicate)
  }

  if (offerGenreTypes?.length && !hasGtls) {
    const offerGenreTypesPredicate = buildOfferGenreTypesPredicate(offerGenreTypes)
    facetFilters.push(offerGenreTypesPredicate)
  }

  if (objectIds && objectIds.length > 0) {
    const objectIdsPredicate = buildObjectIdsPredicate(objectIds)
    facetFilters.push(objectIdsPredicate)
  }

  if (eanList && eanList?.length > 0) {
    const eanIdsPredicate = buildEanPredicate(eanList)
    facetFilters.push(eanIdsPredicate)
  }

  if (artistName) {
    const artistNamePredicate = buildArtistNamePredicate(artistName)
    facetFilters.push([artistNamePredicate])
  }

  if (allocineId) {
    const allocineIdPredicate = buildAllocineIdPredicate([allocineId])
    facetFilters.push(allocineIdPredicate)
  }

  if (allocineIdList && allocineIdList.length > 0) {
    const allocineIdListParsed = parseAndCleanStringsToNumbers(allocineIdList)
    const allocineIdPredicate = buildAllocineIdPredicate(allocineIdListParsed)
    facetFilters.push(allocineIdPredicate)
  }

  if (isDigital) {
    const isDigitalPredicate = [`${FACETS_FILTERS_ENUM.OFFER_IS_DIGITAL}:true`]
    facetFilters.push(isDigitalPredicate)
  }

  const offerIsDuoPredicate = buildOfferIsDuoPredicate(offerIsDuo)
  if (offerIsDuoPredicate) facetFilters.push(offerIsDuoPredicate)

  const tagsPredicate = buildTagsPredicate(tags)
  if (tagsPredicate) facetFilters.push(tagsPredicate)

  if (venue && typeof venue.venueId === 'number')
    facetFilters.push([`${FACETS_FILTERS_ENUM.VENUE_ID}:${venue.venueId}`])

  if (hasGtls) {
    const gtlsPredicate = buildOfferGtlsPredicate(gtls)
    facetFilters.push(gtlsPredicate)
  }

  if (disabilitiesProperties) {
    const accessibilityFilters = buildAccessibiltyFiltersPredicate(disabilitiesProperties)
    facetFilters.push(...accessibilityFilters)
  }

  if (isHeadline) {
    const isHeadlineFilter = buildHeadlinePredicate(isHeadline)
    facetFilters.push(isHeadlineFilter)
  }

  return { facetFilters }
}
