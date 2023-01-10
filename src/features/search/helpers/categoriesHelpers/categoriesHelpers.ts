import {
  GenreType,
  GenreTypeContentModel,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CategoriesModalView, CATEGORY_CRITERIA } from 'features/search/enums'
import {
  CategoriesViewData,
  DescriptionContext,
  CategoriesModalFormProps,
  SearchState,
} from 'features/search/types'

/**
 * Returns unique objects in array distinct by object key
 */
function getUniqueBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

/**
 * Default `All` value for categories
 */
export const categoryAllValue: SearchGroupResponseModelv2 = {
  value: null,
  name: SearchGroupNameEnumv2.NONE,
}

export function getSearchGroupsByAlphabeticalSorting(data: SearchGroupResponseModelv2[]) {
  return getDataByAlphabeticalSorting(
    data.filter((searchGroup) => searchGroup.name !== SearchGroupNameEnumv2.NONE)
  )
}

/**
 * Returns a `SearchGroupResponseModelv2` from a `SearchGroupEnumv2`.
 */
export function getSearchGroupFromEnum(
  data: SubcategoriesResponseModelv2,
  enumValue: SearchGroupNameEnumv2
) {
  return data.searchGroups.find((searchGroup) => searchGroup.name === enumValue)
}

/**
 * Returns an array of `SearchGroupResponseModelv2` from an array of `SearchGroupEnumv2`.
 *
 * This is used to map searchState `offerCategories` to correct data.
 */
export function getSearchGroupsFromEnumArray(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValues: SearchGroupNameEnumv2[]
) {
  if (!data) return [categoryAllValue]
  return enumValues
    .map((enumValue) => getSearchGroupFromEnum(data, enumValue))
    .filter(Boolean) as SearchGroupResponseModelv2[]
}

/**
 * Returns a `NativeCategoryResponseModelv2` from a `NativeCategoryIdEnumv2`.
 */
export function getNativeCategoryFromEnum(
  data: SubcategoriesResponseModelv2,
  enumValue: NativeCategoryIdEnumv2
) {
  return data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue)
}

/**
 * Returns an array of `NativeCategoryResponseModelv2` from an array of `NativeCategoryIdEnumv2`.
 *
 * This is used to map searchState `offerNativeCategories` to correct data.
 */
export function getNativeCategoriesFromEnumArray(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValues: NativeCategoryIdEnumv2[] | undefined
) {
  if (!data || !enumValues) return null
  return enumValues
    .map((enumValue) => getNativeCategoryFromEnum(data, enumValue))
    .filter(Boolean) as NativeCategoryResponseModelv2[]
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

  return getDataByAlphabeticalSorting(getUniqueBy(nativeCategories, 'name'))
}

export function getGenreTypes(
  data: SubcategoriesResponseModelv2 | undefined,
  nativeCategory: NativeCategoryResponseModelv2 | null
) {
  if (!data) return []
  if (!nativeCategory) return []
  if (!nativeCategory.genreType) return []

  const eligibleGenreTypes = data.genreTypes.filter(
    (genreType) => genreType.name === nativeCategory.genreType
  )

  const genreTypesArray = eligibleGenreTypes.map((genreType) => ({ key: genreType.name }))
  return genreTypesArray.reduce<(GenreTypeContentModel & { key: GenreType })[]>((all, curr) => {
    const genreType = eligibleGenreTypes.find((g) => g.name === curr.key)
    if (!genreType) return all
    for (const item of genreType.values) {
      all.push({ key: curr.key, ...item })
    }

    return all
  }, [])
}

/**
 * Returns correct icon for a category.
 */
export function getIcon<T extends SearchGroupNameEnumv2>(item: T) {
  return CATEGORY_CRITERIA[item].icon
}

/**
 * Check if a `CategoriesViewData` is a category.
 */
export function isCategory<T extends CategoriesViewData>(item: T) {
  const values = Object.values(SearchGroupNameEnumv2)
  return values.includes(item.name as SearchGroupNameEnumv2)
}

/**
 * Check if a `CategoriesViewData` is a native category.
 */
function isNativeCategory<T extends CategoriesViewData>(item: T) {
  const values = Object.values(NativeCategoryIdEnumv2)
  return values.includes(item.name as NativeCategoryIdEnumv2)
}

/**
 * Get description from root filters.
 */
function getCategoryFilterDescription(ctx: DescriptionContext) {
  const { selectedCategory, selectedNativeCategory, selectedGenreType } = ctx

  if (selectedGenreType && selectedNativeCategory)
    return `${selectedNativeCategory.value} - ${selectedGenreType.value}`
  if (selectedNativeCategory) return `${selectedNativeCategory.value}`
  if (selectedCategory) return selectedCategory.value ?? undefined
  return undefined
}

/**
 * When iterating on categories view items, get correct description.
 */
function getCategoryDescription(ctx: DescriptionContext, item: SearchGroupResponseModelv2) {
  const { selectedCategory, selectedNativeCategory, selectedGenreType } = ctx

  if (item.name === SearchGroupNameEnumv2.NONE) return undefined
  if (item.name !== selectedCategory?.name) return undefined
  if (!selectedNativeCategory) return 'Tout'
  if (!selectedNativeCategory.value) return undefined

  if (!selectedGenreType) return selectedNativeCategory.value
  return `${selectedNativeCategory.value} - ${selectedGenreType.value}`
}

/**
 * When iterating on native categories view items, get correct description.
 */
function getNativeCategoryDescription(
  ctx: DescriptionContext,
  item: NativeCategoryResponseModelv2
) {
  const { selectedNativeCategory, selectedGenreType } = ctx
  if (!selectedNativeCategory) return undefined
  if (selectedNativeCategory.name !== item.name) return undefined
  if (!selectedGenreType) return 'Tout'
  return selectedGenreType.value
}

/**
 * Get string description from given context.
 *
 * Used in list to show selected children.
 */
export function getDescription(ctx: DescriptionContext, item?: CategoriesViewData) {
  const { selectedCategory } = ctx
  if (!selectedCategory) return undefined

  if (!item) {
    return getCategoryFilterDescription(ctx)
  }

  if (isCategory(item)) {
    return getCategoryDescription(ctx, item as SearchGroupResponseModelv2)
  }

  if (isNativeCategory(item)) {
    return getNativeCategoryDescription(ctx, item as NativeCategoryResponseModelv2)
  }

  return undefined
}

export function getDefaultFormValues(
  data: SubcategoriesResponseModelv2 | undefined,
  searchState: SearchState,
  defaultView: CategoriesModalView
): CategoriesModalFormProps {
  return {
    category:
      getSearchGroupsFromEnumArray(data, searchState.offerCategories)[0] || categoryAllValue,
    nativeCategory:
      getNativeCategoriesFromEnumArray(data, searchState.offerNativeCategories)?.[0] || null,
    // genreType: getGenreTypesFromOfferGenreTypeArray(data, searchState.offerGenreTypes)?.[0] || null,
    genreType: searchState.offerGenreTypes?.[0] || null,
    currentView: defaultView,
  }
}

export function getCategoriesModalTitle(
  currentView: CategoriesModalView,
  category: SearchGroupResponseModelv2,
  nativeCategory: NativeCategoryResponseModelv2 | null
) {
  switch (currentView) {
    case CategoriesModalView.CATEGORIES:
      return 'Catégories'
    case CategoriesModalView.NATIVE_CATEGORIES:
      return category?.value ?? 'Sous-catégories'
    case CategoriesModalView.GENRES:
      return nativeCategory?.value ?? 'Genres'
    default:
      return 'Catégories'
  }
}

export function buildSearchPayloadValues(form: CategoriesModalFormProps) {
  return {
    offerCategories: form.category?.name === SearchGroupNameEnumv2.NONE ? [] : [form.category.name],
    offerNativeCategories: form.nativeCategory ? [form.nativeCategory.name] : [],
    offerGenreTypes: form.genreType ? [form.genreType] : [],
  }
}

export function getDataByAlphabeticalSorting(
  data: SearchGroupResponseModelv2[] | NativeCategoryResponseModelv2[]
) {
  return data.sort((a, b) => (a?.value || '').localeCompare(b?.value || ''))
}
