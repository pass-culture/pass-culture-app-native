import { FetchAlgoliaParameters, FiltersArray } from '..'
import { FACETS_ENUM } from '../enums'

export const buildFacetFilters = ({
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

const buildTagsPredicate = (tags: FetchAlgoliaParameters['tags']): FiltersArray[0] | undefined => {
  if (tags.length > 0) {
    return tags.map((tag: string) => `${FACETS_ENUM.OFFER_TAGS}:${tag}`)
  }
  return undefined
}
