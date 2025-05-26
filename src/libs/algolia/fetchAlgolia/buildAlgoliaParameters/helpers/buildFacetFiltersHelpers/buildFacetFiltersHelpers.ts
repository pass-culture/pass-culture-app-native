import {
  GenreType,
  GTL,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { BooksNativeCategoriesEnum, OfferGenreType } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { FiltersArray, SearchQueryParameters } from 'libs/algolia/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { GtlLevel } from 'shared/gtl/types'

export const buildOfferCategoriesPredicate = (searchGroups: SearchGroupNameEnumv2[]): string[] =>
  searchGroups.map((searchGroup) => `${FACETS_FILTERS_ENUM.OFFER_SEARCH_GROUP_NAME}:${searchGroup}`)

export const buildOfferSubcategoriesPredicate = (subcategoryIds: SubcategoryIdEnumv2[]): string[] =>
  subcategoryIds.map(
    (subcategoryId) => `${FACETS_FILTERS_ENUM.OFFER_SUB_CATEGORY}:${subcategoryId}`
  )

export const buildOfferGtl = (gtlLevel: GtlLevel, gtlLabel: string) => {
  const filterName = FACETS_FILTERS_ENUM.OFFER_GTL_LEVEL.replace('XX', String(gtlLevel))
  return [`${filterName}:${gtlLabel}`]
}

export const buildOfferGtlsPredicate = (gtls: GTL[]) =>
  gtls.map((gtl) => {
    const filterName = FACETS_FILTERS_ENUM.OFFER_GTL_CODE.replace('XX', String(gtl.level))
    return `${filterName}:${gtl.code}`
  })

export const buildOfferNativeCategoriesPredicate = (
  nativeCategories: NativeCategoryIdEnumv2[] | BooksNativeCategoriesEnum[]
) =>
  nativeCategories.map((nativeCategory) => {
    return nativeCategory in BooksNativeCategoriesEnum
      ? `${FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY}:${NativeCategoryIdEnumv2.LIVRES_PAPIER}`
      : `${FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY}:${nativeCategory}`
  })

const offerGenreTypesPredicate = {
  [GenreType.MOVIE]: FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES,
  [GenreType.BOOK]: FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE,
  [GenreType.MUSIC]: FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE,
  [GenreType.SHOW]: FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE,
}

export const buildOfferGenreTypesPredicate = (offerGenreTypes: OfferGenreType[]) =>
  offerGenreTypes.map((offerGenreType) =>
    offerGenreTypesPredicate[offerGenreType.key]
      ? `${offerGenreTypesPredicate[offerGenreType.key]}:${offerGenreType.name}`
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

export const buildAllocineIdPredicate = (allocineId: number) => [
  `${FACETS_FILTERS_ENUM.OFFER_ALLOCINE_ID}:${allocineId}`,
]

export const buildOfferIsDuoPredicate = (offerIsDuo: boolean): string[] | undefined =>
  offerIsDuo ? [`${FACETS_FILTERS_ENUM.OFFER_IS_DUO}:true`] : undefined

export const buildTagsPredicate = (
  tags: SearchQueryParameters['tags']
): FiltersArray[0] | undefined => {
  if (tags.length > 0) return tags.map((tag: string) => `${FACETS_FILTERS_ENUM.OFFER_TAGS}:${tag}`)
  return undefined
}

export const buildHeadlinePredicate = (isHeadline: boolean) => [
  `${FACETS_FILTERS_ENUM.OFFER_IS_HEADLINE}:${isHeadline.toString()}`,
]

export const buildAccessibiltyFiltersPredicate = ({
  isAudioDisabilityCompliant,
  isMentalDisabilityCompliant,
  isMotorDisabilityCompliant,
  isVisualDisabilityCompliant,
}: DisabilitiesProperties) => {
  const filters: string[][] = []
  if (isAudioDisabilityCompliant) {
    filters.push([`${FACETS_FILTERS_ENUM.VENUE_AUDIO_DISABILITY_COMPLIANT}:true`])
  }
  if (isMentalDisabilityCompliant) {
    filters.push([`${FACETS_FILTERS_ENUM.VENUE_MENTAL_DISABILITY_COMPLIANT}:true`])
  }
  if (isMotorDisabilityCompliant) {
    filters.push([`${FACETS_FILTERS_ENUM.VENUE_MOTOR_DISABILITY_COMPLIANT}:true`])
  }
  if (isVisualDisabilityCompliant) {
    filters.push([`${FACETS_FILTERS_ENUM.VENUE_VISUAL_DISABILITY_COMPLIANT}:true`])
  }
  return filters
}
