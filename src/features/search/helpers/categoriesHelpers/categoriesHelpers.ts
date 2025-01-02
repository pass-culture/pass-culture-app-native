import {
  BookType,
  GenreType,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { NativeCategoryEnum } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export type CategoryKey = NativeCategoryIdEnumv2 | SearchGroupNameEnumv2 | string

export type BaseCategory = {
  children: CategoryKey[]
  label: string
  key: CategoryKey
  position?: number
  searchFilter?: string
  searchValue?: string
  nbResultsFacet?: number
}
export type CategoriesMapping = Record<CategoryKey, BaseCategory>

export const ROOT_ALL: BaseCategory = {
  children: [],
  label: ALL_CATEGORIES_LABEL,
  key: 'ROOT_ALL',
  position: -Infinity,
}
export const ALL: BaseCategory = {
  children: [],
  label: 'Tout',
  key: 'ALL',
  position: -Infinity,
}
export const ROOT: BaseCategory = {
  children: [ROOT_ALL.key],
  label: 'Catégories',
  key: 'ROOT',
  position: -Infinity,
}

const getCategoriesMapping = () => {
  const categories = [
    { key: 'CINEMA', label: 'Cinéma', position: 2, children: ['SEANCE'] },
    { key: 'LIVRES', label: 'Livres', position: 1, children: [] },
    { key: 'MUSIQUE', label: 'Musique', position: 3, children: ['SEANCE'] },
    { key: 'SEANCE', label: 'Séance de cinéma', position: 1, children: ['THRILLER'] },
    { key: 'THRILLER', label: 'Thriller', position: 1, children: [] },
  ]

  const mapping = categories.reduce<CategoriesMapping>((mapping, category) => {
    mapping[category.key] = category
    mapping[category.key]?.children.push(ALL.key)
    return mapping
  }, {} as CategoriesMapping)
  mapping[ROOT.key] = ROOT

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
}

export const getCategoryParents = (categoryKey: CategoryKey) => {
  const mapping = getCategoriesMapping()
  return Object.values(mapping).filter((category) => category.children.includes(categoryKey))
}

export const getTopLevelCategories = () => {
  return getCategoryChildren(ROOT.key)
}

export const categoryExists = (categoryKey: CategoryKey) => {
  return Object.keys(getCategoriesMapping()).includes(categoryKey)
}

export const isChild = (childKey: CategoryKey, parentKey: CategoryKey) => {
  return getCategoriesMapping()[parentKey]?.children.includes(childKey) ?? false
}

export function buildSearchPayloadValues(categories: BaseCategory[]) {
  return categories.reduce((payload: Record<string, string>, category: BaseCategory) => {
    if (category.searchFilter && category.searchValue)
      payload[category.searchFilter] = category.searchValue
    return payload
  }, {})
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
  enumValue: NativeCategoryEnum | undefined
) {
  if (data && enumValue) {
    return (
      data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue) ||
      getBooksNativeCategories(data).find((nativeCategory) => nativeCategory.name === enumValue)
    )
  }

  return undefined
}

/**
 * Returns unique objects in array distinct by object key
 */
function getUniqueBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

export function isOnlyOnline(categoryKeys: CategoryKey[]) {
  const { data = PLACEHOLDER_DATA } = useSubcategories()
  const platforms: OnlineOfflinePlatformChoicesEnumv2[] = [
    ...new Set(
      data.subcategories
        .filter((subcategory) =>
          categoryKeys.some((categoryKey) => subcategory.searchGroupName.includes(categoryKey))
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
 * Sort comparator for `SearchGroupResponseModelv2` and `NativeCategoryResponseModelv2` objects.
 */
export function searchGroupOrNativeCategorySortComparator<
  T extends SearchGroupResponseModelv2 | NativeCategoryResponseModelv2,
>(a: T, b: T) {
  return (a?.value ?? '').localeCompare(b?.value ?? '')
}

/**
 * Check whether a native category is a subcategory of a category.
 */
export function isNativeCategoryOfCategory(
  data?: SubcategoriesResponseModelv2,
  searchGroup?: SearchGroupNameEnumv2,
  nativeCategory?: NativeCategoryIdEnumv2
) {
  if (!data) return false
  return data.subcategories.some(
    (subcategory) =>
      subcategory.searchGroupName === searchGroup && subcategory.nativeCategoryId === nativeCategory
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

/**
 * Return `nativeCategory` array for a `SearchGroupResponseModelv2` category.
 */
export function getNativeCategories(
  data: SubcategoriesResponseModelv2 | undefined,
  categoryEnum: SearchGroupNameEnumv2 | undefined
) {
  if (!data) return []
  if (!categoryEnum) return []
  if (categoryEnum === SearchGroupNameEnumv2.NONE) return []

  const nativeCategories = data.nativeCategories.filter((nativeCategory) =>
    nativeCategory.parents.includes(categoryEnum)
  )

  return getUniqueBy(nativeCategories, 'name').sort(searchGroupOrNativeCategorySortComparator)
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

function getIsCategory(item: Item): item is SearchGroupNameEnumv2 {
  return Object.values(SearchGroupNameEnumv2).includes(item as SearchGroupNameEnumv2)
}

function getIsNativeCategory(
  item: Item
): item is NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum {
  return (
    Object.values(NativeCategoryIdEnumv2).includes(item as NativeCategoryIdEnumv2) ||
    Object.values(BooksNativeCategoriesEnum).includes(item as BooksNativeCategoriesEnum)
  )
}

function getFilterRowDescriptionFromNativeCategoryAndGenre(
  data: SubcategoriesResponseModelv2,
  nativeCategoryId: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum | null,
  genreTypeId: string
) {
  if (genreTypeId && nativeCategoryId) {
    const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId)
    const genreType = getGenreTypeFromEnum(data, genreTypeId)
    if (!nativeCategory || !genreType || !nativeCategory.value) return undefined
    return `${nativeCategory.value} - ${genreType.value}`
  }

  return undefined
}

function getFilterRowDescriptionFromNativeCategory(
  data: SubcategoriesResponseModelv2,
  nativeCategoryId: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum | null
) {
  if (nativeCategoryId) {
    const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId)
    if (!nativeCategory) return undefined
    return nativeCategory.value ?? undefined
  }

  return undefined
}

function getFilterRowDescriptionFromCategory(
  data: SubcategoriesResponseModelv2,
  categoryId: SearchGroupNameEnumv2
) {
  if (categoryId === SearchGroupNameEnumv2.NONE) return ALL_CATEGORIES_LABEL

  const category = getCategoryFromEnum(data, categoryId)
  if (!category) return undefined
  return category.value ?? undefined
}

function getFilterRowDescription(data: SubcategoriesResponseModelv2, ctx: DescriptionContext) {
  const { category: categoryId, nativeCategory: nativeCategoryId, genreType: genreTypeId } = ctx

  if (genreTypeId && nativeCategoryId) {
    return getFilterRowDescriptionFromNativeCategoryAndGenre(data, nativeCategoryId, genreTypeId)
  }
  if (nativeCategoryId) {
    return getFilterRowDescriptionFromNativeCategory(data, nativeCategoryId)
  }

  if (categoryId) {
    return getFilterRowDescriptionFromCategory(data, categoryId)
  }
  return undefined
}

function getCategoryDescription(
  data: SubcategoriesResponseModelv2,
  ctx: DescriptionContext,
  item: SearchGroupNameEnumv2
) {
  const { category: categoryId, nativeCategory: nativeCategoryId, genreType: genreTypeId } = ctx

  if (item === SearchGroupNameEnumv2.NONE) return undefined
  if (item !== categoryId) return undefined
  if (!nativeCategoryId) return 'Tout'

  const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId)
  if (!nativeCategory) return undefined
  if (!nativeCategory.value) return undefined

  if (!genreTypeId) return nativeCategory.value
  const genreType = getGenreTypeFromEnum(data, genreTypeId)

  if (!genreType) return nativeCategory.value
  return `${nativeCategory.value} - ${genreType.value}`
}

function getNativeCategoryDescription(
  data: SubcategoriesResponseModelv2,
  ctx: DescriptionContext,
  item: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum
) {
  const { nativeCategory: nativeCategoryId, genreType: genreTypeId } = ctx

  if (!nativeCategoryId) return undefined
  if (nativeCategoryId !== item) return undefined
  if (!genreTypeId) return 'Tout'

  const genreType = getGenreTypeFromEnum(data, genreTypeId)
  return genreType?.value
}

export function getDescription(
  data: SubcategoriesResponseModelv2 | undefined,
  ctx: DescriptionContext,
  item?: Item
) {
  const { category: categoryId } = ctx
  if (!categoryId) return undefined
  if (!data) return undefined

  if (!item) {
    return getFilterRowDescription(data, ctx)
  }

  if (getIsCategory(item)) {
    return getCategoryDescription(data, ctx, item)
  }

  if (getIsNativeCategory(item)) {
    return getNativeCategoryDescription(data, ctx, item)
  }

  return undefined
}

export function getDefaultFormView(tree: MappingTree, searchState: SearchState) {
  const { offerGenreTypes, offerCategories, offerNativeCategories } = searchState

  if (!offerCategories?.[0]) return CategoriesModalView.CATEGORIES
  const category = tree[offerCategories[0]]
  const nativeCategories = category?.children
  const nativeCategory =
    offerNativeCategories?.[0] && nativeCategories
      ? nativeCategories[offerNativeCategories[0]]
      : undefined

  if (offerGenreTypes?.length || nativeCategory?.children) return CategoriesModalView.GENRES
  if (offerNativeCategories?.length || Object.keys(nativeCategories ?? {}).length)
    return CategoriesModalView.NATIVE_CATEGORIES
  return CategoriesModalView.CATEGORIES
}

export function getDefaultFormValues(
  tree: MappingTree,
  searchState: SearchState
): CategoriesModalFormProps {
  return {
    category: searchState.offerCategories[0] ?? SearchGroupNameEnumv2.NONE,
    nativeCategory: searchState.offerNativeCategories?.[0] ?? null,
    genreType: searchState.offerGenreTypes?.[0]?.name ?? null,
    currentView: getDefaultFormView(tree, searchState),
  }
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
