import {
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CategoriesModalView, CATEGORY_CRITERIA } from 'features/search/enums'
import { MappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DescriptionContext, SearchState } from 'features/search/types'

type Item = SearchGroupNameEnumv2 | NativeCategoryIdEnumv2 | string | null

export function buildSearchPayloadValues(
  data: SubcategoriesResponseModelv2,
  form: CategoriesModalFormProps
) {
  const buildGenreType = (genreTypeId: typeof form.genreType) => {
    if (genreTypeId === null) return []
    const genreType = getGenreTypeFromEnum(data, genreTypeId)
    if (!genreType) return undefined

    const genreTypeKey = data.genreTypes.find((genreType) =>
      genreType.values.map((v) => v.name).includes(genreTypeId)
    )?.name
    if (!genreTypeKey) return undefined

    return [{ name: genreTypeId, value: genreType.value, key: genreTypeKey }]
  }

  const genreType = buildGenreType(form.genreType)

  if (!genreType) return undefined

  return {
    offerCategories: form.category === SearchGroupNameEnumv2.NONE ? [] : [form.category],
    offerNativeCategories: form.nativeCategory ? [form.nativeCategory] : [],
    offerGenreTypes: buildGenreType(form.genreType),
  }
}

/**
 * Returns unique objects in array distinct by object key
 */
function getUniqueBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

export function getCategoryFromEnum(data: undefined, enumValue: undefined): undefined
export function getCategoryFromEnum(data: undefined, enumValue: SearchGroupNameEnumv2): undefined
export function getCategoryFromEnum(
  data: SubcategoriesResponseModelv2,
  enumValue: undefined
): undefined
export function getCategoryFromEnum(
  data: SubcategoriesResponseModelv2,
  enumValue: SearchGroupNameEnumv2
): SearchGroupResponseModelv2
export function getCategoryFromEnum(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValue?: SearchGroupNameEnumv2
) {
  if (data && enumValue) {
    return data.searchGroups.find((category) => category.name === enumValue)
  }

  return undefined
}

/**
 * Returns correct icon for a category.
 */
export function getIcon<T extends SearchGroupNameEnumv2>(item: T) {
  return CATEGORY_CRITERIA[item]?.icon
}

export function getCategoriesModalTitle(
  data: SubcategoriesResponseModelv2 | undefined,
  currentView: CategoriesModalView,
  categoryId: SearchGroupNameEnumv2,
  nativeCategoryId: NativeCategoryIdEnumv2 | null
) {
  if (!data) return 'Catégories'
  switch (currentView) {
    case CategoriesModalView.CATEGORIES:
      return 'Catégories'
    case CategoriesModalView.NATIVE_CATEGORIES: {
      const category = getCategoryFromEnum(data, categoryId)
      return category?.value ?? 'Sous-catégories'
    }
    case CategoriesModalView.GENRES: {
      const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId ?? undefined)
      return nativeCategory?.value ?? 'Genres'
    }
    default:
      return 'Catégories'
  }
}

/**
 * Returns a `NativeCategoryResponseModelv2` from a `NativeCategoryIdEnumv2`.
 */
export function getNativeCategoryFromEnum(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValue: NativeCategoryIdEnumv2 | undefined
) {
  if (data && enumValue) {
    return data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue)
  }

  return undefined
}

export function getGenreTypeFromEnum(
  data: SubcategoriesResponseModelv2 | undefined,
  genreType?: string
) {
  if (data && genreType) {
    return data.genreTypes
      .map((gt) => gt.values)
      .flat()
      .find((genreTypeValue) => genreTypeValue.name === genreType)
  }

  return undefined
}

/**
 * Returns whether the category or native category is only online or not.
 * @param data
 * @param categoryId
 * @param nativeCategoryId
 */
export function isOnlyOnline(
  data: SubcategoriesResponseModelv2,
  categoryId?: SearchGroupNameEnumv2,
  nativeCategoryId?: NativeCategoryIdEnumv2
) {
  if (!categoryId && !nativeCategoryId) {
    return false
  }

  const platforms: OnlineOfflinePlatformChoicesEnumv2[] = [
    ...new Set(
      data.subcategories
        .filter((subcategory) =>
          nativeCategoryId
            ? subcategory.nativeCategoryId === nativeCategoryId
            : subcategory.searchGroupName === categoryId
        )
        .map((subcategory) => subcategory.onlineOfflinePlatform)
    ),
  ]

  const isOnlyOnline =
    platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE_OR_OFFLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.OFFLINE)

  return isOnlyOnline
}

/**
 * Sort comparator for `SearchGroupResponseModelv2` and `NativeCategoryResponseModelv2` objects.
 */
export function searchGroupOrNativeCategorySortComparator<
  T extends SearchGroupResponseModelv2 | NativeCategoryResponseModelv2
>(a: T, b: T) {
  return (a?.value || '').localeCompare(b?.value || '')
}

/**
 * Check whether a native category is a subcategory of a category.
 */
export function isNativeCategoryOfCategory(
  data?: SubcategoriesResponseModelv2,
  category?: SearchGroupNameEnumv2,
  nativeCategory?: NativeCategoryIdEnumv2
) {
  if (!data) return false

  return data.subcategories.some(
    (subcategory) =>
      subcategory.searchGroupName === category && subcategory.nativeCategoryId === nativeCategory
  )
}

/**
 * Returns `SearchGroupResponseModelv2` array for a `NativeCategoryIdEnumv2` enum.
 */
export function getSearchGroupsEnumArrayFromNativeCategoryEnum(
  data?: SubcategoriesResponseModelv2,
  nativeCategoryId?: NativeCategoryIdEnumv2
) {
  if (!data) return []
  if (!nativeCategoryId) return []

  const categories = data.subcategories
    .filter((subcategory) => subcategory.nativeCategoryId === nativeCategoryId)
    .map((subcategory) => subcategory.searchGroupName)

  return [...new Set(categories)]
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

  const nativeCategories = data.subcategories
    .filter((subcategory) => subcategory.searchGroupName === categoryEnum)
    .map((subcategory) =>
      data.nativeCategories.find(
        (nativeCategory) => nativeCategory.name === subcategory.nativeCategoryId
      )
    )
    // Just in case where the `.find` clause cannot find anything (this cannot happen but `find` definition is that).
    .filter(Boolean) as NativeCategoryResponseModelv2[]

  return getUniqueBy(nativeCategories, 'name').sort(searchGroupOrNativeCategorySortComparator)
}

export function getIsCategory(item: Item): item is SearchGroupNameEnumv2 {
  return Object.values(SearchGroupNameEnumv2).includes(item as SearchGroupNameEnumv2)
}

export function getIsNativeCategory(item: Item): item is NativeCategoryIdEnumv2 {
  return Object.values(NativeCategoryIdEnumv2).includes(item as NativeCategoryIdEnumv2)
}

function getFilterRowDescription(data: SubcategoriesResponseModelv2, ctx: DescriptionContext) {
  const { category: categoryId, nativeCategory: nativeCategoryId, genreType: genreTypeId } = ctx

  if (genreTypeId && nativeCategoryId) {
    const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId)
    const genreType = getGenreTypeFromEnum(data, genreTypeId)
    if (!nativeCategory) return undefined
    if (!genreType) return undefined
    return `${nativeCategory.value} - ${genreType.value}`
  }
  if (nativeCategoryId) {
    const nativeCategory = getNativeCategoryFromEnum(data, nativeCategoryId)
    if (!nativeCategory) return undefined
    return `${nativeCategory.value}`
  }
  if (categoryId) {
    const category = getCategoryFromEnum(data, categoryId)
    if (!category) return undefined
    return category.value ?? undefined
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
  item: NativeCategoryIdEnumv2
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

  const category = tree[offerCategories[0]]
  const nativeCategories = category?.children
  const nativeCategory = offerNativeCategories?.length
    ? nativeCategories?.[offerNativeCategories[0]]
    : undefined

  if (offerGenreTypes?.length || nativeCategory?.children) return CategoriesModalView.GENRES
  if (offerNativeCategories?.length || nativeCategories)
    return CategoriesModalView.NATIVE_CATEGORIES
  return CategoriesModalView.CATEGORIES
}

export function getDefaultFormValues(
  tree: MappingTree | undefined,
  searchState: SearchState
): CategoriesModalFormProps {
  if (!tree)
    return {
      category: SearchGroupNameEnumv2.NONE,
      nativeCategory: null,
      genreType: null,
      currentView: CategoriesModalView.CATEGORIES,
    }

  return {
    category: searchState.offerCategories[0] || SearchGroupNameEnumv2.NONE,
    nativeCategory: searchState.offerNativeCategories?.[0] || null,
    genreType: searchState.offerGenreTypes?.[0]?.name || null,
    currentView: getDefaultFormView(tree, searchState),
  }
}
