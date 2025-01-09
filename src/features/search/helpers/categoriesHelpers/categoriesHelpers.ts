import {
  BookType,
  GenreType,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import {
  ALL,
  BaseCategory,
  CategoriesMapping,
  CategoryKey,
  DEFAULT_CATEGORIES,
  ROOT,
  ROOT_ALL,
  TopLevelCategory,
} from 'features/search/helpers/categoriesHelpers/categories'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const getCategoriesMapping = (categories: BaseCategory[] = DEFAULT_CATEGORIES) => {
  const mapping = categories.reduce<CategoriesMapping>((mapping, category) => {
    mapping[category.key] = structuredClone(category)
    return mapping
  }, {} as CategoriesMapping)
  mapping[ROOT.key] = structuredClone(ROOT)
  mapping[ROOT_ALL.key] = structuredClone(ROOT_ALL)
  mapping[ALL.key] = structuredClone(ALL)

  const childrenCategories = categories.map((category) => category.children).flat()
  const rootCategories = categories
    .filter((category) => !childrenCategories.includes(category.key))
    .map((category) => category.key)
  mapping[ROOT.key]?.children.push(...rootCategories)
  return mapping
}

export const getCategory = (categoryKey: CategoryKey) => {
  const mapping = getCategoriesMapping()
  return mapping[categoryKey]
}

export const getCategoryChildren = (categoryKey: CategoryKey) => {
  const mapping = getCategoriesMapping()
  const category = getCategory(categoryKey)
  return (category?.children ?? [])
    .map((category) => mapping[category])
    .filter((category) => !!category)
    .sort(sortCategoriesPredicate)
}

export const getCategoryParents = (categoryKey: CategoryKey) => {
  const mapping = getCategoriesMapping()
  return Object.values(mapping).filter((category) => category.children.includes(categoryKey))
}

export const isTopLevelCategory = (category: BaseCategory): category is TopLevelCategory =>
  category.key in SearchGroupNameEnumv2 && category.key !== SearchGroupNameEnumv2.NONE

export const getTopLevelCategories = () => {
  return getCategoryChildren(ROOT.key).filter(isTopLevelCategory) // `filter` is useless here, but it helps typing
}

export const categoryExists = (categoryKey: CategoryKey) => {
  return Object.keys(getCategoriesMapping()).includes(categoryKey)
}

export const isChild = (childKey: CategoryKey, parentKey: CategoryKey) => {
  return getCategoriesMapping()[parentKey]?.children.includes(childKey) ?? false
}

export function getBooksNativeCategories(data: SubcategoriesResponseModelv2) {
  const bookTree = data.genreTypes.find(({ name }) => name === GenreType.BOOK)?.trees as BookType[]

  return bookTree.map((bookCategory) => {
    const categoryName = getKeyFromStringLabel(bookCategory.label)
    return { name: categoryName, value: bookCategory.label, genreType: GenreType.BOOK }
  })
}

/**
 * Returns a `NativeCategoryResponseModelv2` from a `NativeCategoryIdEnumv2`.
 */
export function getNativeCategoryFromEnum(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValue?: CategoryKey
) {
  if (data && enumValue) {
    return (
      data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue) ||
      getBooksNativeCategories(data).find((nativeCategory) => nativeCategory.name === enumValue)
    )
  }

  return undefined
}

export function isOnlyOnline(categoryKeys: CategoryKey[]) {
  const { data = PLACEHOLDER_DATA } = useSubcategories()
  const platforms: OnlineOfflinePlatformChoicesEnumv2[] = [
    ...new Set(
      data.subcategories
        .filter((subcategory) =>
          categoryKeys.some(
            (categoryKey) =>
              subcategory.searchGroupName === categoryKey ||
              subcategory.nativeCategoryId === categoryKey
          )
        )
        .map((subcategory) => subcategory.onlineOfflinePlatform)
    ),
  ]

  return (
    platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE_OR_OFFLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.OFFLINE)
  )
}

/**
 * Returns `SearchGroupResponseModelv2` array for a `NativeCategoryIdEnumv2` enum.
 */
export function getSearchGroupsEnumArrayFromNativeCategoryEnum(
  data?: SubcategoriesResponseModelv2,
  nativeCategoryId?: NativeCategoryIdEnumv2,
  availableCategoriesList?: SearchGroupNameEnumv2[]
) {
  if (!data) return []
  if (!nativeCategoryId) return []
  if (!availableCategoriesList) return []

  const searchGroup = data.nativeCategories
    .find((nativeCategory) => nativeCategory.name === nativeCategoryId)
    ?.parents.filter((nativeCategoryParent) =>
      availableCategoriesList.includes(nativeCategoryParent)
    )

  return [...new Set(searchGroup)]
}

export const useSubcategoryIdsFromSearchGroups = (
  searchGroups: SearchGroupNameEnumv2[]
): SubcategoryIdEnumv2[] => {
  const { data } = useSubcategories()

  if (!data || !searchGroups.length) return []

  const { nativeCategories, subcategories } = data

  const filteredNativeCategories = nativeCategories
    .filter((nativeCategory) =>
      nativeCategory.parents.some((parent) => searchGroups.includes(parent))
    )
    .map((filteredNativeCategory) => filteredNativeCategory.name)

  return subcategories
    .filter((subcategory) => filteredNativeCategories.includes(subcategory.nativeCategoryId))
    .map((filteredSubcategory) => filteredSubcategory.id)
}

export function getFacetTypeFromGenreTypeKey(genreTypeKey: GenreType) {
  switch (genreTypeKey) {
    case GenreType.BOOK:
      return FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE
    case GenreType.MUSIC:
      return FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE
    case GenreType.SHOW:
      return FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE
    case GenreType.MOVIE:
    default:
      return FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES
  }
}

export function getNbResultsFacetLabel(nbResultsFacet?: number) {
  if (nbResultsFacet === undefined) {
    return undefined
  } else if (nbResultsFacet > 10000) {
    return '+10000'
  } else {
    return `${nbResultsFacet}`
  }
}

export const sortCategoriesPredicate = (a: BaseCategory, b: BaseCategory) =>
  (a.position ?? Infinity) - (b.position ?? Infinity) || a.label.localeCompare(b.label)

export function getKeyFromStringLabel(input?: string | null): string | null {
  if (!input) return null
  return input
    .toUpperCase()
    .replace('&', 'ET')
    .replace('-', '_')
    .replace(',', '')
    .replace(/ /g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
