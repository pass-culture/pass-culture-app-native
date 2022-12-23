import {
  GenreType,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { LocationType } from 'features/search/enums'
import { OfferGenreType } from 'features/search/types'
import { FACETS_ENUM } from 'libs/algolia/enums'
import { FiltersArray, SearchParametersQuery } from 'libs/algolia/types'

const underageFilter = [[`${FACETS_ENUM.OFFER_ID_FORBIDDEN_TO_UNDERAGE}:false`]]
const defaultFilter = [[`${FACETS_ENUM.OFFER_IS_EDUCATIONAL}:false`]]

export const buildFacetFilters = ({
  isUserUnderage,
  locationFilter,
  objectIds,
  offerCategories,
  offerGenreTypes,
  offerIsDuo,
  offerNativeCategories,
  offerSubcategories,
  offerTypes,
  tags,
}: Pick<
  SearchParametersQuery,
  | 'locationFilter'
  | 'offerCategories'
  | 'offerGenreTypes'
  | 'offerIsDuo'
  | 'offerNativeCategories'
  | 'offerSubcategories'
  | 'offerTypes'
  | 'tags'
> & { isUserUnderage: boolean; objectIds?: string[] }): null | {
  facetFilters: FiltersArray
} => {
  if (offerCategories.length === 0 && offerTypes == null && offerIsDuo === false) return null

  const facetFilters = [...defaultFilter]

  if (isUserUnderage) facetFilters.push(...underageFilter)

  if (offerCategories.length > 0) {
    const categoriesPredicate = buildOfferCategoriesPredicate(offerCategories)
    facetFilters.push(categoriesPredicate)
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

  const offerTypesPredicate = buildOfferTypesPredicate(offerTypes)
  if (offerTypesPredicate) facetFilters.push(...offerTypesPredicate)

  const offerIsDuoPredicate = buildOfferIsDuoPredicate(offerIsDuo)
  if (offerIsDuoPredicate) facetFilters.push(offerIsDuoPredicate)

  const tagsPredicate = buildTagsPredicate(tags)
  if (tagsPredicate) facetFilters.push(tagsPredicate)

  if (
    locationFilter.locationType === LocationType.VENUE &&
    typeof locationFilter.venue.venueId === 'number'
  )
    facetFilters.push([`${FACETS_ENUM.VENUE_ID}:${locationFilter.venue.venueId}`])

  const atLeastOneFacetFilter = facetFilters.length > 0
  return atLeastOneFacetFilter ? { facetFilters } : null
}

const buildOfferCategoriesPredicate = (searchGroups: SearchGroupNameEnumv2[]): string[] =>
  searchGroups.map((searchGroup) => `${FACETS_ENUM.OFFER_SEARCH_GROUP_NAME}:${searchGroup}`)

const buildOfferSubcategoriesPredicate = (subcategoryIds: SubcategoryIdEnumv2[]): string[] =>
  subcategoryIds.map((subcategoryId) => `${FACETS_ENUM.OFFER_SUB_CATEGORY}:${subcategoryId}`)

const buildOfferNativeCategoriesPredicate = (nativeCategories: NativeCategoryIdEnumv2[]) =>
  nativeCategories.map((nativeCategory) => `${FACETS_ENUM.OFFER_NATIVE_CATEGORY}:${nativeCategory}`)

const buildOfferGenreTypesPredicate = (offerGenreTypes: OfferGenreType[]) => {
  return offerGenreTypes.map((offerGenreType) => {
    switch (offerGenreType.key) {
      case GenreType.MOVIE:
        return `${FACETS_ENUM.OFFER_MOVIE_GENRES}:${[offerGenreType.name]}`
      case GenreType.BOOK:
        return `${FACETS_ENUM.OFFER_BOOK_TYPE}:${offerGenreType.name}`
      case GenreType.MUSIC:
        return `${FACETS_ENUM.OFFER_MUSIC_TYPE}:${offerGenreType.name}`
      case GenreType.SHOW:
        return `${FACETS_ENUM.OFFER_SHOW_TYPE}:${offerGenreType.name}`
      default:
        return ''
    }
  })
}

const buildObjectIdsPredicate = (objectIds: string[]): string[] =>
  objectIds.map((objectId) => `${FACETS_ENUM.OBJECT_ID}:${objectId}`)

const buildOfferIsDuoPredicate = (offerIsDuo: boolean): string[] | undefined =>
  offerIsDuo ? [`${FACETS_ENUM.OFFER_IS_DUO}:${offerIsDuo}`] : undefined

const buildOfferTypesPredicate = (
  offerTypes: SearchParametersQuery['offerTypes']
): FiltersArray | undefined => {
  const { isDigital, isEvent, isThing } = offerTypes
  const DIGITAL = `${FACETS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`
  const EVENT = `${FACETS_ENUM.OFFER_IS_EVENT}:${isEvent}`
  const THING = `${FACETS_ENUM.OFFER_IS_THING}:${isThing}`

  if (isDigital) {
    if (!isEvent && !isThing) return [[DIGITAL]]
    if (!isEvent && isThing) return [[THING]]
    if (isEvent && !isThing) return [[DIGITAL, EVENT]]
  } else {
    if (!isEvent && isThing) return [[DIGITAL], [THING]]
    if (isEvent && !isThing) return [[EVENT]]
    if (isEvent && isThing) return [[DIGITAL]]
  }
  return undefined
}

const buildTagsPredicate = (tags: SearchParametersQuery['tags']): FiltersArray[0] | undefined => {
  if (tags.length > 0) return tags.map((tag: string) => `${FACETS_ENUM.OFFER_TAGS}:${tag}`)
  return undefined
}
