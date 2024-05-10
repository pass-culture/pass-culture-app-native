import {
  BookSubType,
  BookType,
  GenreType,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { CategoriesModalView, CATEGORY_CRITERIA } from 'features/search/enums'
import {
  createMappingTree,
  getBooksGenreTypes,
  getBooksNativeCategories,
  getKeyFromStringLabel,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import {
  DescriptionContext,
  BooksNativeCategoriesEnum,
  SearchState,
  NativeCategoryEnum,
} from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

type Item = SearchGroupNameEnumv2 | NativeCategoryIdEnumv2 | string | null

function isBookNativeCategory(
  category: NativeCategoryEnum | null
): category is BooksNativeCategoriesEnum {
  return (category as BooksNativeCategoriesEnum) !== undefined
}

function isNativeCategory(category: NativeCategoryEnum | null): category is NativeCategoryIdEnumv2 {
  return (category as NativeCategoryIdEnumv2) !== undefined
}

export const buildBookSearchPayloadValues = (
  data: SubcategoriesResponseModelv2,
  form: CategoriesModalFormProps
) => {
  const bookTrees = data.genreTypes.find((genreType) => genreType.name === GenreType.BOOK)
    ?.trees as BookType[]

  const buildNativeCategoryGtls = (nativeCategory: typeof form.nativeCategory) => {
    const nativeCat = bookTrees.find(
      (category: BookType) => getKeyFromStringLabel(category.label) === nativeCategory
    )
    return nativeCat?.gtls
  }

  const buildGenreTypeGtls = (
    nativeCategory: typeof form.nativeCategory,
    genreType: typeof form.genreType
  ) => {
    const nativeCat = bookTrees.find(
      (category: BookType) => getKeyFromStringLabel(category.label) === nativeCategory
    )
    return nativeCat?.children.find((genre) => getKeyFromStringLabel(genre.label) === genreType)
      ?.gtls
  }

  const buildBookGenreType = (genreType?: BookSubType) => {
    const genreKey = getKeyFromStringLabel(genreType?.label)
    if (!!genreType && !!genreKey) {
      return [
        {
          name: genreKey,
          value: genreType.label,
          key: GenreType.BOOK,
        },
      ]
    }
    return undefined
  }

  let gtls
  const natCatGtls = buildNativeCategoryGtls(form.nativeCategory)
  const genreTypeGtls = buildGenreTypeGtls(form.nativeCategory, form.genreType)

  if (form.genreType) {
    gtls = genreTypeGtls?.map((gtl) => gtl)
  } else if (form.nativeCategory) {
    gtls = natCatGtls?.map((gtl) => gtl)
  }

  const nativeCat = bookTrees.find(
    (category: BookType) => getKeyFromStringLabel(category.label) === form.nativeCategory
  )

  const genreType = nativeCat?.children.find(
    (genre) => getKeyFromStringLabel(genre.label) === form.genreType
  )

  const offerNativeCategories =
    form.nativeCategory && isNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []
  const offerBookNativeCategories =
    form.nativeCategory && isBookNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []

  const offerGenericNativeCategories = offerBookNativeCategories ? offerNativeCategories : []

  return {
    offerCategories: [form.category],
    offerNativeCategories: offerGenericNativeCategories,
    offerGenreTypes: buildBookGenreType(genreType),
    gtls,
  }
}

function buildSearchPayloadValues(
  data: SubcategoriesResponseModelv2,
  form: CategoriesModalFormProps,
  enableNewMapping?: boolean
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

  if (form.category === SearchGroupNameEnumv2.LIVRES && enableNewMapping) {
    return buildBookSearchPayloadValues(data, form)
  }

  const genreType = buildGenreType(form.genreType)
  if (!genreType) return undefined

  const offerNativeCategories =
    form.nativeCategory && isNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []
  const offerBookNativeCategories =
    form.nativeCategory && isBookNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []

  const offerGenericNativeCategories = offerBookNativeCategories ? offerNativeCategories : []

  return {
    offerCategories: form.category === SearchGroupNameEnumv2.NONE ? [] : [form.category],
    offerNativeCategories: offerGenericNativeCategories,
    offerGenreTypes: buildGenreType(form.genreType),
    gtls: [],
  }
}

/**
 * Returns unique objects in array distinct by object key
 */
function getUniqueBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

function getCategoryFromEnum(data: undefined, enumValue: undefined): undefined
function getCategoryFromEnum(data: undefined, enumValue: SearchGroupNameEnumv2): undefined
function getCategoryFromEnum(data: SubcategoriesResponseModelv2, enumValue: undefined): undefined
function getCategoryFromEnum(
  data: SubcategoriesResponseModelv2,
  enumValue: SearchGroupNameEnumv2
): SearchGroupResponseModelv2
function getCategoryFromEnum(
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
  nativeCategoryId: NativeCategoryEnum | null
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
  enumValue: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum | undefined
) {
  if (data && enumValue) {
    return (
      data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue) ||
      getBooksNativeCategories(data).find((nativeCategory) => nativeCategory.name === enumValue)
    )
  }

  return undefined
}

function getGenreTypeFromEnum(data: SubcategoriesResponseModelv2 | undefined, genreType?: string) {
  if (data && genreType) {
    const genre = data.genreTypes
      .map((gt) => gt.values)
      .flat()
      .find((genreTypeValue) => genreTypeValue.name === genreType)

    const bookGenre = getBooksGenreTypes(data).find(
      (genreTypeValue) => genreTypeValue.name === genreType
    )
    return genre ?? bookGenre
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
  nativeCategoryId?: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum
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
  T extends SearchGroupResponseModelv2 | NativeCategoryResponseModelv2,
>(a: T, b: T) {
  return (a?.value ?? '').localeCompare(b?.value ?? '')
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

export const useNativeCategories = (nativeCategory?: SearchGroupNameEnumv2) => {
  const { data: subcategories } = useSubcategories()
  const { facets } = useSearchResults()
  const enableNewMapping = true
  const tree = createMappingTree(subcategories, facets, enableNewMapping)

  const nativeCategories =
    nativeCategory &&
    nativeCategory !== SearchGroupNameEnumv2.NONE &&
    (tree[nativeCategory].children as MappedNativeCategories)

  const nativeCategoriesMap = nativeCategories ? Object.entries(nativeCategories) : []

  if (nativeCategory === SearchGroupNameEnumv2.LIVRES)
    return nativeCategoriesMap.filter(
      ([_k, item]) => item.genreTypeKey === GenreType.BOOK && item.label !== 'Livres papier'
    )

  return nativeCategoriesMap
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
  const nativeCategory = offerNativeCategories?.[0]
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

export const handleCategoriesSearchPress = (
  form: CategoriesModalFormProps,
  data: SubcategoriesResponseModelv2,
  enableNewMapping?: boolean
) => {
  if (!data) {
    return
  }

  const payload = buildSearchPayloadValues(data, form, enableNewMapping)
  if (!payload) return

  let isFullyDigitalOffersCategory = false
  if (payload.offerNativeCategories.length > 0) {
    isFullyDigitalOffersCategory = isOnlyOnline(data, undefined, payload.offerNativeCategories[0])
  } else if (payload.offerCategories.length > 0) {
    isFullyDigitalOffersCategory = isOnlyOnline(data, payload.offerCategories[0])
  }

  return { payload, isFullyDigitalOffersCategory }
}
