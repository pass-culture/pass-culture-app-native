import {
  GenreType,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { OfferGenreType } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums'
import { FiltersArray, SearchQueryParameters } from 'libs/algolia/types'
import { eventMonitoring } from 'libs/monitoring'

export const buildOfferCategoriesPredicate = (searchGroups: SearchGroupNameEnumv2[]): string[] =>
  searchGroups.map((searchGroup) => `${FACETS_FILTERS_ENUM.OFFER_SEARCH_GROUP_NAME}:${searchGroup}`)

export const buildOfferSubcategoriesPredicate = (subcategoryIds: SubcategoryIdEnumv2[]): string[] =>
  subcategoryIds.map(
    (subcategoryId) => `${FACETS_FILTERS_ENUM.OFFER_SUB_CATEGORY}:${subcategoryId}`
  )

export const buildOfferNativeCategoriesPredicate = (nativeCategories: NativeCategoryIdEnumv2[]) =>
  nativeCategories.map(
    (nativeCategory) => `${FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY}:${nativeCategory}`
  )

const offerGenreTypesPredicate = {
  [GenreType.MOVIE]: FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES,
  [GenreType.BOOK]: FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE,
  [GenreType.MUSIC]: FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE,
  [GenreType.SHOW]: FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE,
}

export const buildOfferGenreTypesPredicate = (offerGenreTypes: OfferGenreType[]) =>
  offerGenreTypes.map((offerGenreType) =>
    offerGenreTypesPredicate[offerGenreType.key]
      ? `${offerGenreTypesPredicate[offerGenreType.key]}:${[offerGenreType.name]}`
      : ''
  )

export const buildObjectIdsPredicate = (objectIds: string[]) => {
  try {
    return objectIds.map((objectId) => `${FACETS_FILTERS_ENUM.OBJECT_ID}:${objectId}`)
  } catch (error) {
    eventMonitoring.captureException(error, {
      level: 'error',
      extra: { objectIds },
    })
    return []
  }
}
export const buildEanPredicate = (eanList: string[]) =>
  eanList.map((ean) => `${FACETS_FILTERS_ENUM.OFFER_EAN}:${ean}`)

export const buildOfferIsDuoPredicate = (offerIsDuo: boolean): string[] | undefined =>
  offerIsDuo ? [`${FACETS_FILTERS_ENUM.OFFER_IS_DUO}:${offerIsDuo}`] : undefined

export const buildOfferTypesPredicate = (
  offerTypes: SearchQueryParameters['offerTypes']
): FiltersArray | undefined => {
  const { isDigital, isEvent, isThing } = offerTypes
  const DIGITAL = `${FACETS_FILTERS_ENUM.OFFER_IS_DIGITAL}:${isDigital}`
  const EVENT = `${FACETS_FILTERS_ENUM.OFFER_IS_EVENT}:${isEvent}`
  const THING = `${FACETS_FILTERS_ENUM.OFFER_IS_THING}:${isThing}`

  if ((isDigital && !isEvent && !isThing) || (!isDigital && isEvent && isThing)) return [[DIGITAL]]
  else if (isDigital && !isEvent && isThing) return [[THING]]
  else if (isDigital && isEvent && !isThing) return [[DIGITAL, EVENT]]
  else if (!isDigital && !isEvent && isThing) return [[DIGITAL], [THING]]
  else if (!isDigital && isEvent && !isThing) return [[EVENT]]

  return undefined
}

export const buildTagsPredicate = (
  tags: SearchQueryParameters['tags']
): FiltersArray[0] | undefined => {
  if (tags.length > 0) return tags.map((tag: string) => `${FACETS_FILTERS_ENUM.OFFER_TAGS}:${tag}`)
  return undefined
}
